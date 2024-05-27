import { Injectable } from '@nestjs/common';
import { CreatePackageDto } from './dto/create-package.dto';
import {
  CancelPackageStockDto,
  CompletePackageStockDto,
  ConfirmPackageStockDto,
  UpdatePackageDto,
} from './dto/update-package.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Package } from './entities/package.entity';
import { Repository } from 'typeorm';
import { PackageGallery } from './entities/packager-gallery.entity';
import { AddPackageGalleryDto } from './dto/add-gallery-to-even.dto';

@Injectable()
export class PackageService {
  constructor(
    @InjectRepository(Package)
    private readonly packageRepository: Repository<Package>,
    @InjectRepository(PackageGallery)
    private readonly galleryRepository: Repository<PackageGallery>,
  ) {}

  create(createPackageDto: CreatePackageDto) {
    return this.packageRepository.save(createPackageDto);
  }

  findAll() {
    return this.packageRepository.find({
      relations: {
        event: true,
      },
    });
  }

  findByEvent(eventId: number) {
    return this.packageRepository.find({
      relations: { event: true, galleries: true },
      where: [{ event: { id: eventId } }, { isActive: true }],
    });
  }

  findOne(id: number) {
    return this.packageRepository.findOne({
      relations: { event: true },
      where: [{ id: id }],
    });
  }

  update(id: number, updatePackageDto: UpdatePackageDto) {
    return this.packageRepository.update(id, updatePackageDto);
  }

  updateStockQuantity(id: number, updatePackageDto: UpdatePackageDto) {
    return this.packageRepository.update(id, updatePackageDto);
  }

  completeStockQuantity(id: number, updatePackageDto: CompletePackageStockDto) {
    return this.packageRepository.update(id, updatePackageDto);
  }

  confirmStockQuantity(id: number, updatePackageDto: ConfirmPackageStockDto) {
    return this.packageRepository.update(id, updatePackageDto);
  }

  cancelStockQuantity(id: number, updatePackageDto: CancelPackageStockDto) {
    return this.packageRepository.update(id, updatePackageDto);
  }

  remove(id: number) {
    return this.packageRepository.delete(id);
  }

  async removeGallery(bannerId: number) {
    return this.packageRepository.delete(bannerId);
  }
  async addGallery(addGalleryToEventDto: AddPackageGalleryDto) {
    const id = addGalleryToEventDto.eventId;
    const pack = await this.packageRepository.findOneBy({ id });
    const banner = new PackageGallery();
    if (pack) {
      banner.imgUrl = addGalleryToEventDto.bannerUrl;
      banner.package = pack;
    }
    return this.packageRepository.save(banner);
  }

  async updateGallery(id: number, bannerUrl: string) {
    const banner = await this.galleryRepository.findOneBy({ id });
    if (banner) {
      banner.imgUrl = bannerUrl;
    }
    return this.packageRepository.update(id, banner);
  }
}
