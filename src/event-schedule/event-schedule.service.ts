import { Injectable } from '@nestjs/common';
import { CreateEventScheduleDto } from './dto/create-event-schedule.dto';
import { UpdateEventScheduleDto } from './dto/update-event-schedule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EventSchedule } from './entities/event-schedule.entity';
import { Repository } from 'typeorm';
import { WEEKDAYS } from 'src/utills/enum';

@Injectable()
export class EventScheduleService {
  constructor(
    @InjectRepository(EventSchedule)
    private readonly userRepository: Repository<EventSchedule>,
  ) {}

  create(createEventScheduleDto: CreateEventScheduleDto) {
    createEventScheduleDto.weekDay =
      WEEKDAYS[new Date(createEventScheduleDto.date).getDay()];
    return this.userRepository.save(createEventScheduleDto);
  }

  findAll() {
    return this.userRepository.find({
      relations: {
        event: true,
      },
    });
  }

  findByEvent(eventId: number) {
    console.log(eventId)
    // return this.userRepository.find({
    //   relations: {
    //     event: true,
    //   },
    // });
    return this.userRepository.find({
      relations: { event: true },
      where: {event:{id:eventId}},
    });
  }

  findOne(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  update(id: number, updateEventScheduleDto: UpdateEventScheduleDto) {
    return this.userRepository.update(id, updateEventScheduleDto);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
