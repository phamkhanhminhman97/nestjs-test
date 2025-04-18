import axios, { HttpStatusCode } from 'axios';
import { Repository, In } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';

import { Asset } from '../../../entities/Asset';
import { Location } from '../../../entities/Location';
import { LOCATION_STATUS } from './common/constant';

@Injectable()
export class AssetService {
  private readonly logger = new Logger(AssetService.name);

  constructor(
    @InjectRepository(Asset)
    private assetRepository: Repository<Asset>,

    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
  ) {}

  // /**
  //  * TODO: Delete this after verification
  //  */
  // async onModuleInit() {
  //   this.syncAssets()
  // }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async syncAssets() {
    this.logger.log('Starting asset synchronization...');

    try {
      const apiUrl = process.env.URL_SYNC;
      if (!apiUrl) throw new Error('Missing URL_SYNC in environment variables');

      // 1. Fetch active locations
      const activeLocations = await this.locationRepository.find({
        where: { status: LOCATION_STATUS.ACTIVED },
        select: ['id', 'status'],
      });

      if (!activeLocations.length) {
        this.logger.warn('No active locations found. Skipping synchronization.');
        return;
      }

      const locationMap = new Map(activeLocations.map((loc) => [loc.id, loc]));

      // 2. Call API to retrieve assets
      const response = await this.retryAxios({
        method: 'GET',
        url: apiUrl,
        timeout: 3000,
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status !== HttpStatusCode.Ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const assets = response.data;
      if (!Array.isArray(assets)) throw new Error('Assets data is not an array');

      const now = new Date();
      const validAssets = [];
      const skippedAssets = [];

      // 3. Filter valid assets
      for (const asset of assets) {
        if (!asset.id || !asset.location_id || !asset.created_at) {
          skippedAssets.push(`Invalid fields: ${JSON.stringify(asset)}`);
          continue;
        }

        const createdAt = new Date(asset.created_at * 1000);
        if (isNaN(createdAt.getTime()) || createdAt >= now) {
          skippedAssets.push(`Invalid created_at: ${asset.id}`);
          continue;
        }

        if (!locationMap.has(asset.location_id)) {
          skippedAssets.push(`Location not found or inactive: ${asset.id}`);
          continue;
        }

        validAssets.push({ ...asset, createdAt });
      }

      if (!validAssets.length) {
        this.logger.warn('No valid assets to sync.');
        return;
      }

      const apiIds = validAssets.map((a) => a.api_id);

      // 4. Transaction: update if exists, insert if new
      await this.assetRepository.manager.transaction(async (manager) => {
        const existingAssets = await manager.find(Asset, {
          where: { api_id: In(apiIds) },
          relations: ['location'],
        });

        const existingMap = new Map(existingAssets.map((a) => [a.api_id, a]));

        const toSave: Asset[] = [];
        let insertedCount = 0;
        let updatedCount = 0;

        for (const asset of validAssets) {
          const existing = existingMap.get(asset.id);

          if (existing) {
            existing.name = asset.type;
            existing.created_at = asset.createdAt;
            existing.location = locationMap.get(asset.location_id);
            toSave.push(existing);
            updatedCount++;
          } else {
            // Create new
            const newAsset = manager.create(Asset, {
              api_id: asset.id,
              name: asset.type,
              created_at: asset.createdAt,
              location: locationMap.get(asset.location_id),
            });
            toSave.push(newAsset);
            insertedCount++;
          }
        }

        await manager.upsert(Asset, toSave, ['api_id']);

        this.logger.log(`Inserted: ${insertedCount}, Updated: ${updatedCount}`);
      });

      // 6. Log skipped assets
      this.logger.log(`Skipped ${skippedAssets.length} invalid assets.`);
    } catch (error) {
      this.logger.error(`Asset synchronization failed: ${error.message}`, error.stack);
      if (error.code === 'ECONNABORTED') {
        this.logger.error('Request timed out after 3 seconds');
      }
    }
  }

  /**
   *
   * @param config
   * @param retries
   * @param delay
   * @returns
   */
  async retryAxios(config: any, retries = 3, delay = 1000): Promise<any> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        return await axios(config);
      } catch (error) {
        const isRetryable =
          error.code === 'ECONNABORTED' || // timeout
          error.response?.status >= 500;

        const isLastAttempt = attempt === retries;

        this.logger.warn(
          `Attempt ${attempt} failed: ${error.message} ${isLastAttempt ? '' : `Retrying in ${delay}ms...`}`,
        );

        if (!isRetryable || isLastAttempt) {
          throw error;
        }

        await new Promise((res) => setTimeout(res, delay));
      }
    }
  }
}
