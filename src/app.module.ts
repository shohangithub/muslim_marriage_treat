import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { RoomModule } from './room/room.module';
import { AuthModule } from './auth/auth.module';
import { RoomTypeModule } from './room-type/room-type.module';
import { TreatModule } from './treat/treat.module';
import { BookingModule } from './booking/booking.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3303,
      username: 'sa',
      password: '1qazZAQ!',
      database: 'muslim_marriage_treat',
      entities: [__dirname + '/../**/*.entity.js'],
      synchronize: true,
    }),
    UserModule,
    RoomModule,
    AuthModule,
    RoomTypeModule,
    TreatModule,
    BookingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
