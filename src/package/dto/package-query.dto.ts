import { PartialType } from '@nestjs/swagger';
import { PaginationQuery } from 'src/utills/pagination';

export class PackageQueryDto extends PartialType(PaginationQuery) {
  eventId: number;
}
