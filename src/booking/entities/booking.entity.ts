import { Room } from 'src/room/entities/room.entity';
import { BOOKING_STATUS, TRANS_METHOD } from 'src/utills/enum';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  transactionMethod!: TRANS_METHOD;

  @Column({ unique: true, nullable: true })
  transactionNo!: string;


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

  @Column({ default: new Date((new Date().setMinutes(new Date().getMinutes()+5))).getTime()})
  expireTime!: string;

  @Column()
  bookedFrom: string;

  @Column({ default: BOOKING_STATUS.PENDING })
  bookingStatus: BOOKING_STATUS;

  @ManyToOne(() => Room, (room) => room.bookings)
  room: Room;
}
