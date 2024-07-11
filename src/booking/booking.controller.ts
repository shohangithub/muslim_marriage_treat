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
  UseGuards,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CompleteBookingDto, UpdateBookingDto } from './dto/update-booking.dto';
import { BookingQueryDto } from './dto/booking-query.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  create(@Ip() ip: string, @Body() createBookingDto: CreateBookingDto) {
    createBookingDto.bookedFrom = ip;
    return this.bookingService.create(createBookingDto);
  }
  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.bookingService.findAll();
  }
  @UseGuards(AuthGuard)
  @Get('pagination')
  pagination(@Query() paginationQuery: BookingQueryDto) {
    return this.bookingService.pagination(paginationQuery);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingService.findOne(+id);
  }

  @UseGuards(AuthGuard)
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
  @UseGuards(AuthGuard)
  @Put('cancel-booking/:id')
  cancelBooking(@Param('id') id: number) {
    return this.bookingService.cancelBooking(id);
  }

  @UseGuards(AuthGuard)
  @Put('confirm-booking/:id')
  confirmBooking(@Param('id') id: number) {
    return this.bookingService.confirmBooking(id);
  }

  @UseGuards(AuthGuard)
  @Put('refund-booking/:id')
  refundBooking(@Param('id') id: number) {
    return this.bookingService.refundBooking(id);
  }
  

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingService.remove(+id);
  }
}
