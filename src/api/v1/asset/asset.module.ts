import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetService } from './asset.service';
import { Asset } from '../../../entities/Asset';
import { Location } from '../../../entities/Location';
import { Organization } from '../../../entities/Organization';

@Module({
  imports: [TypeOrmModule.forFeature([Asset, Location, Organization])],
  providers: [AssetService],
})
export class AssetModule {}
