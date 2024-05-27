import { Module } from '@nestjs/common';
import { PackageService } from './package.service';
import { PackageController } from './package.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Package } from './entities/package.entity';
import { PackageGallery } from './entities/packager-gallery.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Package,PackageGallery])],
  controllers: [PackageController],
  providers: [PackageService],
  exports:[PackageService]
})
export class PackageModule {}
