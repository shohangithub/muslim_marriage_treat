import { PartialType } from '@nestjs/swagger';
import { PaginationQuery } from 'src/utills/pagination';

export class BookingQueryDto extends PartialType(PaginationQuery) {
  eventId: number;
}
