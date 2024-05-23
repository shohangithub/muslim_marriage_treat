import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { Equal, MoreThan, Repository } from 'typeorm';
import {  AddGalleryToEventDto } from './dto/add-gallery-to-even.dto';
import { EventGallery } from './entities/eventgallery.entity';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(EventGallery)
    private readonly bannerRepository: Repository<EventGallery>,
  ) {}

  async create(createEventDto: CreateEventDto) {
    return this.eventRepository.save(createEventDto);
  }

  findAll() {
    return this.eventRepository.find({
      relations: {
        venues: true,
        instructors: true,
        galleries:true
      },
    });
  }

  upcomingEvent() {
    return this.eventRepository.find({
      relations: {
        venues: true,
        instructors: true,
        galleries:true
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
    return this.eventRepository.findOneBy({ id });
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
  async removeBanner(bannerId: number) {
    return this.bannerRepository.delete(bannerId);
  }
  async addBannerToEvent(addGalleryToEventDto:AddGalleryToEventDto ) {
    const id=addGalleryToEventDto.eventId;
    const event = await this.eventRepository.findOneBy({id});
    const banner = new EventGallery();
    if (event) {
      banner.imgUrl = addGalleryToEventDto.bannerUrl;
      banner.event = event;
    }
    return this.bannerRepository.save(banner);
  }
  async updateBanner(id:number, bannerUrl: string){
    const banner=await this.bannerRepository.findOneBy({id});
    if(banner){
      banner.imgUrl=bannerUrl;
    }
    return this.bannerRepository.update(id,banner);
  }
  
}
