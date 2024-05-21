import { Booking } from 'src/booking/entities/booking.entity';
import { Event } from 'src/event/entities/event.entity';
import { PACKAGE_PERSON, PACKAGE_TYPE } from 'src/utills/enum';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Package {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  packageName: string;

  @Column()
  packageType: PACKAGE_TYPE;

  @Column()
  packagePerson: PACKAGE_PERSON;
  
  @Column()
  acitivities!: string;

  @Column({ length: 1000 })
  highlightFeatures!: string;

  @Column({ length: 1000 })
  features!: string;

  @ManyToOne(() => Event, (event) => event.packages)
  event: Event;

  @Column()
  packagePrice: number;

  @Column({ default: 0 })
  totalQty: number;

  @Column({ default: 0 })
  bookedQty: number;

  @Column({ default: 0 })
  lockedQty: number;

  @Column({ default: 0 })
  availableQty: number;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Booking, (booking) => booking.package)
  bookings!: Booking[];
}
