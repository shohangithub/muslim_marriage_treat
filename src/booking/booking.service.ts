import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CompleteBookingDto, UpdateBookingDto } from './dto/update-booking.dto';
import { Booking } from './entities/booking.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, LessThan, Repository } from 'typeorm';
import { BOOKING_STATUS } from 'src/utills/enum';
import { uuid } from 'uuidv4';
import { PackageService } from 'src/package/package.service';
import { ManagePackageStockDto } from 'src/package/dto/update-package.dto';

@Injectable()
export class BookingService {
  readonly bookingExpireTime = process.env.BOOKING_EXPIRE_TIME;
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    private readonly packageService: PackageService,
  ) {}

  create(createBookingDto: CreateBookingDto) {
    this.packageService.findOne(createBookingDto.package.id).then((res) => {
      if (res) {
        if (res.totalQty > 0) {
          createBookingDto.transactionNumber = uuid();

          const result = this.bookingRepository.save(createBookingDto);
          const stock: ManagePackageStockDto = {
            totalQty: res.totalQty - 1,
            bookedQty: res.bookedQty + 1,
          };
          this.packageService.updateStockQuantity(res.id, stock);
          return result;
        } else if (res.bookedQty > 0) {
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
    });
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
            bookingStatus: Equal(BOOKING_STATUS.BOOKED),
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
                bookedQty: pack.bookedQty - 1,
              };
              this.packageService.updateStockQuantity(pack.id, stock);
            }
          }
          this.bookingRepository.delete(res.map((x) => x.id));
        }
      });
  }

  completeBooking(id: number, dto: CompleteBookingDto) {
    return this.bookingRepository.update(id, {
      transactionMethod: dto.transactionMethod,
      confirmationCode: dto.confirmationCode,
      bookingStatus: BOOKING_STATUS.CONFIRMED,
    });
  }

  remove(id: number) {
    return this.bookingRepository.delete(id);
  }
}
