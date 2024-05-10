import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private readonly userRepository: Repository<Room>,
  ) {}

  create(createRoomDto: CreateRoomDto) {
    return this.userRepository.save(createRoomDto);
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  update(id: number, updateRoomDto: UpdateRoomDto) {
    return this.userRepository.update(id, updateRoomDto);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
