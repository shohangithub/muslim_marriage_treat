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
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    AzureBlobModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],      
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DATABASE_HOST'),
        port: parseInt(configService.get<string>('DATABASE_PORT')),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASS'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
      }),
      inject: [ConfigService],
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
