import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { PackageModule } from 'src/package/package.module';
import { MailService } from 'src/mail/mail.service';
import { Package } from 'src/package/entities/package.entity';

@Module({
  imports:[PackageModule, TypeOrmModule.forFeature([Booking,Package])],
  controllers: [BookingController],
  providers: [BookingService,MailService],
  exports: [BookingService],
})
export class BookingModule {}
