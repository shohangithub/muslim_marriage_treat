import { Injectable } from '@nestjs/common';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Package } from './entities/package.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PackageService {
  constructor(
    @InjectRepository(Package)
    private readonly userRepository: Repository<Package>,
  ) {}

  create(createPackageDto: CreatePackageDto) {
    return this.userRepository.save(createPackageDto);
  }

  findAll() {
    return this.userRepository.find({
      relations: {
          event: true,
      },
  });
  }

  findOne(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  update(id: number, updatePackageDto: UpdatePackageDto) {
    return this.userRepository.update(id, updatePackageDto);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
