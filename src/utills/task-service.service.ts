import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BookingService } from 'src/booking/booking.service';

@Injectable()
export class TasksService {
  constructor(private readonly bookingRepository: BookingService) {}
  private readonly logger = new Logger(TasksService.name);

  @Cron(CronExpression.EVERY_12_HOURS)
  handleCron() {
    this.logger.debug('Operation start');
    this.bookingRepository.removeUnusedBooking();
    this.logger.debug('Operation completed');
  }
}
