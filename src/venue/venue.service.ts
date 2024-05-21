import { Injectable } from '@nestjs/common';
import { CreateVenueDto } from './dto/create-venue.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';
import { Venue } from './entities/venue.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
 
@Injectable()
export class VenueService {
  constructor(
    @InjectRepository(Venue)
    private readonly venuRepository:Repository<Venue>
  ) {}
 
  create(createVenueDto: CreateVenueDto) {
    return this.venuRepository.save(createVenueDto);
  }
 
  findAll() {
    return this.venuRepository.find();
  }
 
  findOne(id: number) {
    return this.venuRepository.findOneBy({id})
  }
 
  update(id: number, updateVenueDto: UpdateVenueDto) {
    return this.venuRepository.update(id,updateVenueDto);
  }
 
  remove(id: number) {
    return this.venuRepository.delete(id);
  }
}
 