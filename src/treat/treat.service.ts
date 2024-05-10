import { Injectable } from '@nestjs/common';
import { CreateTreatDto } from './dto/create-treat.dto';
import { UpdateTreatDto } from './dto/update-treat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Treat } from './entities/treat.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TreatService {
  constructor(
    @InjectRepository(Treat)
    private readonly userRepository:Repository<Treat>
  ) {}

  create(createTreatDto: CreateTreatDto) {
    return this.userRepository.save(createTreatDto);
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return this.userRepository.findOneBy({id})
  }

  update(id: number, updateTreatDto: UpdateTreatDto) {
    return this.userRepository.update(id,updateTreatDto);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
