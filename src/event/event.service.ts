import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { Equal, MoreThan, Repository } from 'typeorm';
import { Instructor } from 'src/instructor/entities/instructor.entity';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  async create(createEventDto: CreateEventDto) {
    console.log(createEventDto)
    const instructors = [];
    for (const item of createEventDto.instructors) {
      const entity = new Instructor();
      entity.name = item.name;
      entity.degree = item.name;
      entity.imageUrl = item.name;
      await this.eventRepository.manager.save(entity);
      instructors.push(entity);
    }

    createEventDto.instructors = instructors;
    console.log(createEventDto)
    return this.eventRepository.save(createEventDto);
  }

  findAll() {
    return this.eventRepository.find();
  }

  upcomingEvent() {
    return this.eventRepository.find({
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
    return this.eventRepository.findOneBy({ id });
  }

  update(id: number, updateEventDto: UpdateEventDto) {
    return this.eventRepository.update(id, updateEventDto);
  }

  remove(id: number) {
    return this.eventRepository.delete(id);
  }
}
