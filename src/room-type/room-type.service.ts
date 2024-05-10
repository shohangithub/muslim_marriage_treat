import { Injectable } from '@nestjs/common';
import { CreateRoomTypeDto } from './dto/create-room-type.dto';
import { UpdateRoomTypeDto } from './dto/update-room-type.dto';
import { RoomType } from './entities/room-type.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RoomTypeService {
  constructor(
    @InjectRepository(RoomType)
    private readonly userRepository:Repository<RoomType>
  ) {}

  create(createRoomTypeDto: CreateRoomTypeDto) {
    return this.userRepository.save(createRoomTypeDto);
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return this.userRepository.findOneBy({id})
  }

  update(id: number, updateRoomTypeDto: UpdateRoomTypeDto) {
    return this.userRepository.update(id,updateRoomTypeDto);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}