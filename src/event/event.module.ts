import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { EventGallery } from './entities/eventgallery.entity';
@Module({
  imports:[TypeOrmModule.forFeature([Event,EventGallery])],
  controllers: [EventController],
  providers: [EventService],
  exports:[EventService]
})
export class EventModule {}
