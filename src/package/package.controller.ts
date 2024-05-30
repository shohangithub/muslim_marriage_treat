import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query } from '@nestjs/common';
import { PackageService } from './package.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { UpdateGalleryImageDto } from './dto/update-galleryimage.dto';
import { AddPackageGalleryDto } from './dto/add-gallery-to-even.dto';
import { PackageQueryDto } from './dto/package-query.dto';

@Controller('package')
export class PackageController {
  constructor(private readonly packageService: PackageService) {}

  @Post()
  create(@Body() createPackageDto: CreatePackageDto) {
    return this.packageService.create(createPackageDto);
  }

  @Get()
  findAll() {
    return this.packageService.findAll();
  }
  
  @Get('package-summary')
  packageSummary(@Query() paginationQuery: PackageQueryDto) {
    return this.packageService.packageSummary(paginationQuery);
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.packageService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePackageDto: UpdatePackageDto) {
    return this.packageService.update(+id, updatePackageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.packageService.remove(+id);
  }

  @Get('find-by-event/:id')
  findByEvent(@Param('id') eventId: number) {
    return this.packageService.findByEvent(eventId);
  }

  @Delete('removegalleryimage/:id')
  RemoveBanner(@Param('id') id: number) {
    return this.packageService.removeGallery(+id);
  }

  @Post('addimagetoevent')
  addBannerToEvent(@Body() addGalleryToEventDto: AddPackageGalleryDto) {
    return this.packageService.addGallery(addGalleryToEventDto);
  }
  @Put('updategalleryimage')
  updateBanner(@Body() bannerData: UpdateGalleryImageDto) {
    return this.packageService.updateGallery(
      bannerData.id,
      bannerData.bannerUrl,
    );
  }
}
