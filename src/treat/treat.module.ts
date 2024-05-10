import { Module } from '@nestjs/common';
import { TreatService } from './treat.service';
import { TreatController } from './treat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Treat } from './entities/treat.entity';
@Module({
  imports:[TypeOrmModule.forFeature([Treat])],
  controllers: [TreatController],
  providers: [TreatService],
  exports:[TreatService]
})
export class TreatModule {}
