import { PartialType } from '@nestjs/swagger';
import { CreateEventScheduleDto } from './create-event-schedule.dto';

export class UpdateEventScheduleDto extends PartialType(CreateEventScheduleDto) {}
