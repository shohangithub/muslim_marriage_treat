import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CompleteBookingDto, UpdateBookingDto } from './dto/update-booking.dto';
import { Booking } from './entities/booking.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, LessThan, Repository } from 'typeorm';
import { BOOKING_STATUS } from 'src/utills/enum';
import { uuid } from 'uuidv4';
import { PackageService } from 'src/package/package.service';
import {
  CancelPackageStockDto,
  CompletePackageStockDto,
  ConfirmPackageStockDto,
  ManagePackageStockDto,
} from 'src/package/dto/update-package.dto';

@Injectable()
export class BookingService {
  readonly bookingExpireTime = process.env.BOOKING_EXPIRE_TIME;
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    private readonly packageService: PackageService,
  ) {}

  async create(createBookingDto: CreateBookingDto) {
    const res = await this.packageService.findOne(createBookingDto.package.id);
    if (res) {
      if (res.totalQty > 0) {
        createBookingDto.transactionNumber = uuid();

        const result = this.bookingRepository.save(createBookingDto);
        const stock: ManagePackageStockDto = {
          totalQty: res.totalQty - 1,
          reservedQty: res.reservedQty + 1,
        };
        this.packageService.updateStockQuantity(res.id, stock);
        return result;
      } else if (res.confirmedQty > 0) {
        throw new HttpException(
          `Someone booked this package, please try after ${this.bookingExpireTime} minutes !`,
          HttpStatus.BAD_REQUEST,
        );
      } else {
        throw new HttpException(
          `This package already sold out. please try anohter package.`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    throw new HttpException(`Booking data not found.`, HttpStatus.BAD_REQUEST);
  }

  findAll() {
    return this.bookingRepository.find({ relations: { package: true } });
  }

  findOne(id: number) {
    return this.bookingRepository.findOneBy({ id });
  }

  update(id: number, updateBookingDto: UpdateBookingDto) {
    return this.bookingRepository.update(id, updateBookingDto);
  }

  removeUnusedBooking() {
    this.bookingRepository
      .find({
        relations: {
          package: true,
        },
        where: [
          {
            expireTime: LessThan(new Date().getTime().toString()),
            bookingStatus: Equal(BOOKING_STATUS.RESERVED),
          },
        ],
      })
      .then((res) => {
        if (res.length > 0) {
          for (const item of res) {
            const pack = item.package;
            if (pack) {
              const stock: ManagePackageStockDto = {
                totalQty: pack.totalQty + 1,
                reservedQty: pack.reservedQty - 1,
              };
              this.packageService.updateStockQuantity(pack.id, stock);
            }
          }
          this.bookingRepository.delete(res.map((x) => x.id));
        }
      });
  }

  async completeBooking(id: number, dto: CompleteBookingDto) {
    const response = await this.bookingRepository.findOne({
      relations: {
        package: true,
      },
      where: [
        {
          id: id,
          bookingStatus: Equal(BOOKING_STATUS.RESERVED),
        },
      ],
    });

    if (response) {
      const pack = response.package;
      if (pack) {
        const stock: CompletePackageStockDto = {
          bookedQty: pack.bookedQty + 1,
          reservedQty: pack.reservedQty - 1,
        };
        await this.packageService.completeStockQuantity(pack.id, stock);
      }

      return this.bookingRepository.update(id, {
        transactionMethod: dto.transactionMethod,
        confirmationCode: dto.confirmationCode,
        bookingStatus: BOOKING_STATUS.BOOKED,
      });
    }
  }

  async confirmBooking(id: number) {
    const response = await this.bookingRepository.findOne({
      relations: {
        package: true,
      },
      where: [
        {
          id: id,
          bookingStatus: Equal(BOOKING_STATUS.BOOKED),
        },
      ],
    });

    if (response) {
      const pack = response.package;
      if (pack) {
        const stock: ConfirmPackageStockDto = {
          bookedQty: pack.bookedQty - 1,
          confirmedQty: pack.confirmedQty + 1,
        };
        await this.packageService.confirmStockQuantity(pack.id, stock);
      }

      return this.bookingRepository.update(id, {
        bookingStatus: BOOKING_STATUS.CONFIRMED,
      });
    }
  }

  async cancelBooking(id: number) {
    const response = await this.bookingRepository.findOne({
      relations: {
        package: true,
      },
      where: [
        {
          id: id,
          bookingStatus: Equal(BOOKING_STATUS.BOOKED),
        },
      ],
    });

    if (response) {
      const pack = response.package;
      if (pack) {
        const stock: CancelPackageStockDto = {
          totalQty: pack.totalQty + 1,
          confirmedQty: pack.confirmedQty - 1,
        };
        await this.packageService.cancelStockQuantity(pack.id, stock);
      }

      return this.bookingRepository.update(id, {
        bookingStatus: BOOKING_STATUS.CANCELLED,
      });
    }
    throw new HttpException(`Booking data not found.`, HttpStatus.BAD_REQUEST);
  }

  remove(id: number) {
    return this.bookingRepository.delete(id);
  }
}
