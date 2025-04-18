import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { Location } from './Location';

@Entity('assets')
export class Asset {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  api_id: string;

  @Column()
  name: string;

  @Column()
  created_at: Date;

  @ManyToOne(() => Location, (location) => location.assets)
  location: Location;

  @CreateDateColumn()
  synced_at: Date;
}
