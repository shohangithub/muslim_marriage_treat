import { AzureBlobModule } from './azure-blob/azure-blob.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RoomTypeModule } from './room-type/room-type.module';
import { BookingModule } from './booking/booking.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './utills/task-service.service';
import { EventModule } from './event/event.module';
import { PackageModule } from './package/package.module';
import { MailModule } from './mail/mail.module';
import { VenueModule } from './venue/venue.module';
import { InstructorModule } from './instructor/instructor.module';
import { EventScheduleModule } from './event-schedule/event-schedule.module';

@Module({
  imports: [
    AzureBlobModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'http://sql12.freemysqlhosting.net',
      port: 3303,
      username: 'sql12707960',
      password: 'dKMwAx6JEu',
      database: 'muslim_marriage_treat',
      entities: [__dirname + '/../**/*.entity.js'],
      synchronize: true,
    }),
    ScheduleModule.forRoot(),
    UserModule,
    PackageModule,
    AuthModule,
    RoomTypeModule,
    EventModule,
    BookingModule,
    MailModule,
    VenueModule,
    InstructorModule,
    EventScheduleModule,
  ],
  controllers: [AppController],
  providers: [ TasksService, AppService],
})
export class AppModule {}
