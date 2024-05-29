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
import { PackageGallery } from './packager-gallery.entity';

@Entity()
export class Package {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  roomName!: string;

  @Column()
  packageName: string;

  @Column()
  packageType: PACKAGE_TYPE;

  @Column()
  packagePerson: PACKAGE_PERSON;

  @Column({ length: 1000 })
  highlightFeatures!: string;

  @Column({ length: 1000 })
  roomFeatures!: string;

  @Column({ length: 1000 })
  houseFeatures!: string;

  @Column()
  houseFeatureNote!: string;

  @Column({ length: 1500 })
  packageDeal!: string;

  @Column()
  packageDealNote!: string;

  @ManyToOne(() => Event, (event) => event.packages)
  event: Event;

  @Column()
  packagePrice: number;

  @Column({ default: 0 })
  totalQty: number;

  @Column({ default: 0 })
  reservedQty: number;

  @Column({ default: 0 })
  bookedQty: number;

  @Column({ default: 0 })
  confirmedQty: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  orderNumber: number;

  @OneToMany(() => Booking, (booking) => booking.package)
  bookings!: Booking[];

  @OneToMany(() => PackageGallery, (gallery) => gallery.package)
  galleries: PackageGallery[];
}
