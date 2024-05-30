import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
import { PackageQueryDto } from './dto/package-query.dto';

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
      where: { event: { id: eventId }, isActive: true },
      order: { orderNumber: 'ASC' },
    });
  }

  findOne(id: number) {
    return this.packageRepository.findOne({
      relations: { event: true },
      where: { id: id },
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

  async packageSummary(paginationQuery: PackageQueryDto) {
    if (!paginationQuery)
      throw new HttpException(
        `Invalid query parameters !`,
        HttpStatus.BAD_REQUEST,
      );

    if (
      paginationQuery &&
      (paginationQuery.pageIndex < 0 || paginationQuery.pageSize == 0)
    )
      throw new HttpException(
        `Invalid query parameters !`,
        HttpStatus.BAD_REQUEST,
      );

    const query = this.packageRepository
      .createQueryBuilder('package')
      .innerJoinAndSelect('package.event', 'event')
      .where('package.isActive =:status', {
        status: true,
      });

    if (paginationQuery.eventId) {
      query.andWhere('event.id = :eventId', {
        eventId: paginationQuery.eventId,
      });
    }

    if (paginationQuery.openText) {
      query.andWhere('(LOWER(package.packageName) LIKE LOWER(:name))', {
        name: `%${paginationQuery.openText}%`,
      });
    }

    const totalCount = await query.getCount();
    const data = await query
      .orderBy(
        'package.orderNumber',
        paginationQuery.isAscending == 'true' ? 'ASC' : 'DESC',
      )
      .skip(paginationQuery.pageIndex * paginationQuery.pageSize)
      .take(paginationQuery.pageSize)
      .select([
        'package.id',
        'package.packageName',
        'package.totalQty',
        'package.reservedQty',
        'package.bookedQty',
        'package.confirmedQty',
        'package.orderNumber',
        'event.id',
        'event.eventName',
      ])
      .getMany();

    const response = {
      data: data,
      paging: {
        hasNextPage: false,
        hasPreviousPage: false,
        pageSize: 20,
        pageIndex: 0,
        totalData: totalCount,
        totalPages: 0,
      },
    };
    return response;
  }
}
