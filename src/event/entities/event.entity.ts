import { Package } from 'src/package/entities/package.entity';
import { Venue } from 'src/venue/entities/venue.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  eventName: string;

  @Column({type: 'datetime'})
  startDate: Date;

  @Column({type: 'datetime'})
  endDate: Date;

  @Column()
  description: string;

  @Column()
  vanue: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Package, (pack) => pack.event)
  packages!: Package[];

  @ManyToMany(() => Venue)
  @JoinTable()
  venues!: Venue[]
}
