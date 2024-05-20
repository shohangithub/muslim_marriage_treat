import { Module } from '@nestjs/common';
import { EventScheduleService } from './event-schedule.service';
import { EventScheduleController } from './event-schedule.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventSchedule } from './entities/event-schedule.entity';
import { EventRefDto } from 'src/event/entities/event.entity';

@Module({
  imports:[TypeOrmModule.forFeature([EventSchedule,EventRefDto])],
  controllers: [EventScheduleController],
  providers: [EventScheduleService],
})
export class EventScheduleModule {}
