import { Booking } from 'src/booking/entities/booking.entity';
import { RoomType } from 'src/room-type/entities/room-type.entity';
import { Treat } from 'src/treat/entities/treat.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  roomName: string;

  @ManyToOne(() => Treat, (treat) => treat.Rooms)
  treat: Treat;

  @ManyToOne(() => RoomType, (roomType) => roomType.rooms)
  roomType: RoomType;

  @Column()
  packagePrice: number;

  @Column({ default: 0 })
  totalQty: number;

  @Column({ default: 0 })
  bookedQty: number;

  @Column({ default: 0 })
  lookedQty: number;

  @Column({ default: 0 })
  availableRooms: number;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Booking, (booking) => booking.room)
  bookings!:Booking[];
}
