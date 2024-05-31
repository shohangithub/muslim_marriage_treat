import { AzureBlobModule } from './azure-blob/azure-blob.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
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
      host: '107.180.113.203',
      port: 3306,
      username: 'sa',
      password: 'EMytm6Et;9ZL',
      database: 'muslim_couple_retreat',
      entities: [__dirname + '/../**/*.entity.js'],
      synchronize: false,
    }),
    ScheduleModule.forRoot(),
    UserModule,
    PackageModule,
    AuthModule,
    EventModule,
    BookingModule,
    MailModule,
    VenueModule,
    InstructorModule,
    EventScheduleModule,
  ],
  controllers: [AppController],
  providers: [TasksService, AppService],
})
export class AppModule {}
