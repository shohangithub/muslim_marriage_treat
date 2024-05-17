import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { Equal, MoreThan, Repository } from 'typeorm';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly userRepository: Repository<Event>,
  ) {}

  create(createEventDto: CreateEventDto) {
    const startDate = new Date(createEventDto.startDate).toISOString();
    const endDate = new Date(createEventDto.endDate).toISOString();
    createEventDto.startDate = new Date(startDate);
    createEventDto.endDate = new Date(endDate);
    return this.userRepository.save(createEventDto);
  }

  findAll() {
    return this.userRepository.find();
  }

  upcomingEvent() {
    return this.userRepository.find({
      order: {
        startDate: 'ASC',
      },
      where: [
        {
          startDate: MoreThan(new Date()),
          isActive: Equal(true),
        },
      ],
    });
  }

  findOne(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  update(id: number, updateEventDto: UpdateEventDto) {
    return this.userRepository.update(id, updateEventDto);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
