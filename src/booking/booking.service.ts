import { Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CompleteBookingDto, UpdateBookingDto } from './dto/update-booking.dto';
import { Booking } from './entities/booking.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, LessThan, Repository } from 'typeorm';
import { BOOKING_STATUS } from 'src/utills/enum';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly userRepository: Repository<Booking>,
  ) {}

  create(createBookingDto: CreateBookingDto) {
    return this.userRepository.save(createBookingDto);
  }

  findAll() {
    return this.userRepository.find({ relations: { room: true } });
  }

  findOne(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  update(id: number, updateBookingDto: UpdateBookingDto) {
    return this.userRepository.update(id, updateBookingDto);
  }

  removeUnusedBooking() {
    this.userRepository
      .find({
        where: [
          {
            expireTime: LessThan(new Date().getTime().toString()),
            bookingStatus: Equal(BOOKING_STATUS.PENDING),
          },
        ],
      })
      .then((res) => {
        // console.log(res)
        // console.log(new Date(new Date().getTime()))
        // console.log(new Date(1715593009978))
        // console.log(new Date(1715596549978))
        if (res.length > 0) {
          this.userRepository.delete(res.map((x) => x.id));
        }
      });
  }
  completeBooking(id: number, dto: CompleteBookingDto) {
    return this.userRepository.update(id, {
      transactionMethod: dto.transactionMethod,
      transactionNo: dto.transactionNo,
      bookingStatus: BOOKING_STATUS.COMPLETED,
    });
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
