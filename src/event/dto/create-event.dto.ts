import { Transform } from 'class-transformer';
import { IsDate, IsNotEmpty, MinDate } from 'class-validator';
import { EventSchedule } from 'src/event-schedule/entities/event-schedule.entity';
import { Instructor } from 'src/instructor/entities/instructor.entity';
import { Package } from 'src/package/entities/package.entity';
import { Venue } from 'src/venue/entities/venue.entity';

export class CreateEventDto {
  @IsNotEmpty()
  eventName: string;
  
  @Transform(({ value }) => value && new Date(value))
  @IsDate()
  @MinDate(new Date())
  startDate?: Date;

  @Transform(({ value }) => value && new Date(value))
  @IsDate()
  @MinDate(new Date())
  endDate?: Date;
  description: string;
  @IsNotEmpty()
  slogan: string;
  packageDescription: string;
  bannerUrl: string;
  isActive: boolean;
  orderNumber!: number
  packages: Package[];
  schedules: EventSchedule[];
  instructors: Instructor[];
  venues: Venue[];
}