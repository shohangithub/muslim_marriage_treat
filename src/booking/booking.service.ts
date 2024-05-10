import { Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CompleteBookingDto, UpdateBookingDto } from './dto/update-booking.dto';
import { Booking } from './entities/booking.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    return this.userRepository.find();
  }

  findOne(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  update(id: number, updateBookingDto: UpdateBookingDto) {
    return this.userRepository.update(id, updateBookingDto);
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
