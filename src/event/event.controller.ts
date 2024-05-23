import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { AddGalleryToEventDto } from './dto/add-gallery-to-even.dto';
import { UpdateGalleryImageDto } from './dto/update-galleryimage.dto';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventService.create(createEventDto);
  }

  @Get()
  findAll() {
    return this.eventService.findAll();
  }
  @Get('upcoming-event')
  upcomingEvent() {
    const c = this.eventService.upcomingEvent();
    c.then(x=>console.log(x))
    return c;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventService.update(+id, updateEventDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventService.remove(+id);
  }

  @Delete('removegalleryimage/:id')
  RemoveBanner(@Param('id') id: number) {
    return this.eventService.removeBanner(+id);
  }

  @Post("addimagetoevent")
  addBannerToEvent(@Body() addGalleryToEventDto:AddGalleryToEventDto  ) {
    return this.eventService.addBannerToEvent(addGalleryToEventDto);
  }
  @Put('updategalleryimage')
  updateBanner(@Body() bannerData:UpdateGalleryImageDto) {
    return this.eventService.updateBanner(bannerData.id, bannerData.bannerUrl);
  }
}
