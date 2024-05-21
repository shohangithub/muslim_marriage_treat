import { IsNotEmpty } from 'class-validator';
import { EventSchedule } from 'src/event-schedule/entities/event-schedule.entity';
import { Instructor } from 'src/instructor/entities/instructor.entity';
import { Package } from 'src/package/entities/package.entity';
import { Venue } from 'src/venue/entities/venue.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  eventName: string;

  @Column({type: 'date'})
  startDate: Date;

  @Column({type: 'date'})
  endDate: Date;

  @Column()
  description: string;

  @Column()
  slogan: string;

  @Column()
  bannerUrl: string;
  
  @Column()
  packageDescription!:string

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Package, (pack) => pack.event)
  packages!: Package[];

  @OneToMany(() => EventSchedule, (schedule) => schedule.event)
  schedules!: EventSchedule[];

  @ManyToMany(() => Instructor)
  @JoinTable()
  instructors!: Instructor[]

  @ManyToMany(() => Venue)
  @JoinTable()
  venues!: Venue[]
}



export class EventRefDto {
  @IsNotEmpty()
  id: number;
  @IsNotEmpty()
  eventName: string;
}
