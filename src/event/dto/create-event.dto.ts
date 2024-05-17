import { Transform } from 'class-transformer';
import { IsDate, IsNotEmpty, MinDate } from 'class-validator';
import { Package } from 'src/package/entities/package.entity';

export class CreateEventDto {
  @IsNotEmpty()
  eventName: string;
  @IsNotEmpty()
  @Transform( ({ value }) => value && new Date(value))
  @IsDate()
  @MinDate(new Date())
  startDate: Date;

  @IsNotEmpty()
  @Transform( ({ value }) => value && new Date(value))
  @IsDate()
  @MinDate(new Date())
  endDate: Date;
  description: string;
  vanue: string;
  isActive: boolean;
  packages: Package[];
}
