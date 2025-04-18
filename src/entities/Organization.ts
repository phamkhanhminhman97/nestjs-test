import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Location } from './Location';

@Entity('organization')
export class Organization {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Location, (location) => location.organization)
  locations: Location[];
}
