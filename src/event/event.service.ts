import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { Equal, Repository } from 'typeorm';
import { EVENT_STATUS } from 'src/utills/enum';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  async create(createEventDto: CreateEventDto) {
    return this.eventRepository.save(createEventDto);
  }

  findAll() {
    return this.eventRepository.find({
      relations: {
        venues: true,
        instructors: true,
      },
    });
  }

  upcomingEvent() {
    return this.eventRepository.find({
      relations: {
        venues: true,
      },
      order: {
        orderNumber: 'ASC',
      },
      where: [
        {
          isActive: Equal(true),
        },
        {
          eventStatus: EVENT_STATUS.CURRENT || EVENT_STATUS.UPCOMING,
        },
      ],
    });
  }

  findOne(id: number) {
    return this.eventRepository.findOne({
      relations: {
        venues: true,
        instructors: true,
      },
      where: [
        {
          id: id,
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
