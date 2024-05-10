import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TreatService } from './treat.service';
import { CreateTreatDto } from './dto/create-treat.dto';
import { UpdateTreatDto } from './dto/update-treat.dto';

@Controller('treat')
export class TreatController {
  constructor(private readonly treatService: TreatService) {}

  @Post()
  create(@Body() createTreatDto: CreateTreatDto) {
    return this.treatService.create(createTreatDto);
  }

  @Get()
  findAll() {
    return this.treatService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.treatService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTreatDto: UpdateTreatDto) {
    return this.treatService.update(+id, updateTreatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.treatService.remove(+id);
  }
}
