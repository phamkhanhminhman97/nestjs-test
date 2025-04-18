import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Organization } from './Organization';
import { Asset } from './Asset';
import { LOCATION_STATUS } from './../api/v1/asset/common/constant';

@Entity('locations')
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ enum: LOCATION_STATUS, default: LOCATION_STATUS.ACTIVED })
  status: string;

  @ManyToOne(() => Organization, (organization) => organization.locations)
  organization: Organization;

  @OneToMany(() => Asset, (asset) => asset.location)
  assets: Asset[];
}
