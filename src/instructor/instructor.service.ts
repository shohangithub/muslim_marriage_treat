import { Injectable } from '@nestjs/common';
import { CreateInstructorDto } from './dto/create-instructor.dto';
import { UpdateInstructorDto } from './dto/update-instructor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Instructor } from './entities/instructor.entity';
import { Repository } from 'typeorm';

@Injectable()
export class InstructorService {
  constructor(
    @InjectRepository(Instructor)
    private readonly userRepository: Repository<Instructor>,
  ) {}

  create(createInstructorDto: CreateInstructorDto) {
    return this.userRepository.save(createInstructorDto);
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  update(id: number, updateInstructorDto: UpdateInstructorDto) {
    return this.userRepository.update(id, updateInstructorDto);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
