import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PackageService } from './package.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { UpdateGalleryImageDto } from './dto/update-galleryimage.dto';
import { AddPackageGalleryDto } from './dto/add-gallery-to-even.dto';
import { PackageQueryDto } from './dto/package-query.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('package')
export class PackageController {
  constructor(private readonly packageService: PackageService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createPackageDto: CreatePackageDto) {
    return this.packageService.create(createPackageDto);
  }

  @Get()
  findAll() {
    return this.packageService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('package-summary')
  packageSummary(@Query() paginationQuery: PackageQueryDto) {
    return this.packageService.packageSummary(paginationQuery);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.packageService.findOne(+id);
  }
  
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePackageDto: UpdatePackageDto) {
    return this.packageService.update(+id, updatePackageDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.packageService.remove(+id);
  }

  @Get('find-by-event/:id')
  findByEvent(@Param('id') eventId: number) {
    return this.packageService.findByEvent(eventId);
  }

  @UseGuards(AuthGuard)
  @Delete('removegalleryimage/:id')
  RemoveBanner(@Param('id') id: number) {
    return this.packageService.removeGallery(+id);
  }

  @UseGuards(AuthGuard)
  @Post('addimagetoevent')
  addBannerToEvent(@Body() addGalleryToEventDto: AddPackageGalleryDto) {
    return this.packageService.addGallery(addGalleryToEventDto);
  }

  @UseGuards(AuthGuard)
  @Put('updategalleryimage')
  updateBanner(@Body() bannerData: UpdateGalleryImageDto) {
    return this.packageService.updateGallery(
      bannerData.id,
      bannerData.bannerUrl,
    );
  }
}
