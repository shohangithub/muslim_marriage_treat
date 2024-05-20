import { Event } from 'src/event/entities/event.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EventSchedule {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Event, (event) => event.schedules)
  event: Event;

  @Column({type:'date'})
  date: Date;

  @Column()
  weekDay: string;

  @Column()
  timeRange: string

  @Column()
  acitivity: string

  @Column({nullable: true})
  description?: string;

  @Column({ default: true })
  isActive: boolean;
}
