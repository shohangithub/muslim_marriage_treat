import { Transform } from 'class-transformer';
import { IsDate, IsNotEmpty, MinDate } from 'class-validator';
import { EventRefDto } from 'src/event/entities/event.entity';

export class CreateEventScheduleDto {
  @IsNotEmpty()
  event: EventRefDto;

  @IsNotEmpty()
  @Transform(({ value }) => value && new Date(value))
  @IsDate()
  @MinDate(new Date())
  date: Date;

  weekDay!:string;

  @IsNotEmpty()
  timeRange: string;

  @IsNotEmpty()
  acitivity: string;
  description!: string;
  isActive!: boolean;
}
