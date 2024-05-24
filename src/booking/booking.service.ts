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
import { PaginationQuery } from 'src/utills/pagination';

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
    throw new HttpException(`Package not found.`, HttpStatus.BAD_REQUEST);
  }

  async pagination(paginationQuery: PaginationQuery) {
    console.log(paginationQuery);

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

    const query = this.bookingRepository
      .createQueryBuilder('booking') // first argument is an alias. Alias is what you are selecting - photos. You must specify it.
      //.innerJoinAndSelect("booking.package", "package")
      //.leftJoinAndSelect('booking.package', 'package');
    .where("booking.bookingStatus NOT  RESERVED")
    .andWhere('LOWER(booking.firstName) LIKE LOWER(:name) OR LOWER(booking.lastName) LIKE LOWER(:name)', {
      name: `%${paginationQuery.openText}%`,
  })
    //.andWhere("(booking.name = :photoName OR photo.name = :bearName)")

    const totalCount = await query.getCount();
    const data = await query
      .orderBy(
        'booking.id',
        (paginationQuery.isAscending=='true' ? 'ASC' : 'DESC'),
      )
      .skip(paginationQuery.pageIndex * paginationQuery.pageSize)
      .take(paginationQuery.pageSize)
      //.setParameters({ photoName: "My", bearName: "Mishka" })
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
        bookingMoney:dto.bookingMoney
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
