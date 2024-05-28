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
    private readonly eventRepository: Repository<Event>
  ) {}

  async create(createEventDto: CreateEventDto) {
    return this.eventRepository.save(createEventDto);
  }

  findAll() {
    return this.eventRepository.find({
      relations: {
        venues: true,
        instructors: true
      },
    });
  }

  upcomingEvent() {
    return this.eventRepository.find({
      relations: {
        venues: true
      },
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
    return this.eventRepository.findOne({
      relations: {
        venues: true,
        instructors: true
      },
      where: [
        {
          id: id
        },
      ],
    });
  }

  async update(id: number, updateEventDto: UpdateEventDto) {
    // const event = await this.eventRepository.findOne({
    //   relations: {
    //     venues: true,
    //     instructors: true,
    //   },
    //   where: { id: id },
    // });

    // if (updateEventDto.venues) {
    //   const  existingVanues = event.venues.filter((venue) => {
    //     return updateEventDto.venues.findIndex((x) => x.id == venue.id) > 0;
    //   });
    //   event.venues = existingVanues;
    // }
    // await this.eventRepository.save(event);

    return this.eventRepository.update(id, updateEventDto);
  }

  remove(id: number) {
    return this.eventRepository.delete(id);
  }
}
