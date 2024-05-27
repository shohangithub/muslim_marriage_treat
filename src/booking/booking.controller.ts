import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Ip,
  Put,
  Query,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CompleteBookingDto, UpdateBookingDto } from './dto/update-booking.dto';
import { PaginationQuery } from 'src/utills/pagination';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  create(@Ip() ip: string, @Body() createBookingDto: CreateBookingDto) {
    createBookingDto.bookedFrom = ip;
    return this.bookingService.create(createBookingDto);
  }

  @Get()
  findAll() {
    return this.bookingService.findAll();
  }

  @Get('pagination')
  pagination(@Query() paginationQuery: PaginationQuery) {
    return this.bookingService.pagination(paginationQuery);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingService.update(+id, updateBookingDto);
  }

  @Put('complete-booking/:id')
  completeBooking(
    @Param('id') id: string,
    @Body() updateBookingDto: CompleteBookingDto,
  ) {
    return this.bookingService.completeBooking(+id, updateBookingDto);
  }

  @Put('cancel-booking/:id')
  cancelBooking(@Param('id') id: number) {
    return this.bookingService.cancelBooking(id);
  }
  @Get('confirm-booking/:id')
  confirmBooking(@Param('id') id: number) {
    return this.bookingService.confirmBooking(id);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingService.remove(+id);
  }
}
