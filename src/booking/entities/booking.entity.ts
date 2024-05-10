import { BOOKING_STATUS, TRANS_METHOD } from 'src/utills/enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  transactionMethod!: TRANS_METHOD;

  @Column({ unique: true, nullable: true })
  transactionNo!: string;

  // @ManyToOne(() => Treat, (treat) => treat.Rooms)
  // treat: Treat;

  // @ManyToOne(() => RoomType, (roomType) => roomType.rooms)
  // roomType: RoomType;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column({ default: new Date().getTime() })
  bookedTime: string;

  @Column()
  bookedFrom: string;

  @Column({ default: BOOKING_STATUS.PENDING })
  bookingStatus: BOOKING_STATUS;
}
