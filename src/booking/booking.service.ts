import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CompleteBookingDto, UpdateBookingDto } from './dto/update-booking.dto';
import { Booking } from './entities/booking.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, LessThan, Repository } from 'typeorm';
import { BOOKING_STATUS, PACKAGE_TYPE } from 'src/utills/enum';
import { uuid } from 'uuidv4';
import {
  CancelPackageStockDto,
  CompletePackageStockDto,
  ConfirmPackageStockDto,
  ManagePackageStockDto,
  RefundPackageStockDto,
} from 'src/package/dto/update-package.dto';
import { PaginationQuery } from 'src/utills/pagination';
import { MailService } from 'src/mail/mail.service';
import { Package } from 'src/package/entities/package.entity';

@Injectable()
export class BookingService {
  readonly bookingExpireTime = process.env.BOOKING_EXPIRE_TIME;
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(Package)
    private readonly packageRepository: Repository<Package>,
    private readonly mailService: MailService,
  ) { }

  async create(createBookingDto: CreateBookingDto) {
    const res = await this.packageRepository.findOne({
      relations: { event: true },
      where: [{ id: createBookingDto.package.id }],
    });

    if (res) {
      if (res.totalQty > 0) {
        createBookingDto.transactionNumber = uuid();
        createBookingDto.bookedFrom = new Date().getTime().toString();
        createBookingDto.expireTime = new Date(new Date().setMinutes(new Date().getMinutes() + parseInt(this.bookingExpireTime))).getTime().toString();

        const result = await this.bookingRepository.save(createBookingDto);
        const stock: ManagePackageStockDto = {
          totalQty: res.totalQty - 1,
          reservedQty: res.reservedQty + 1,
        };
        await this.packageRepository.update(res.id, stock)
        return result;
      } else if (res.totalQty == 0 && res.reservedQty == 0) {
        throw new HttpException(
          `This package already sold out. please try anohter.`,
          HttpStatus.BAD_REQUEST,
        );
      } else if (res.totalQty == 0 && res.reservedQty > 0) {
        throw new HttpException(
          `Someone booked this package, please try after ${this.bookingExpireTime} minutes !`,
          HttpStatus.BAD_REQUEST,
        );
      } else {
        throw new HttpException(
          `An error occured.`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    throw new HttpException(`Package not found.`, HttpStatus.BAD_REQUEST);
  }

  async pagination(paginationQuery: PaginationQuery) {
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
      .where('booking.bookingStatus != :status', { status: BOOKING_STATUS.RESERVED })
      .andWhere(
        'LOWER(booking.firstName) LIKE LOWER(:name) OR LOWER(booking.lastName) LIKE LOWER(:name)',
        {
          name: `%${paginationQuery.openText}%`,
          status: BOOKING_STATUS.RESERVED,
        },
      );
    //.andWhere("(booking.name = :photoName OR photo.name = :bearName)")

    const totalCount = await query.getCount();
    const data = await query
      .orderBy(
        'booking.id',
        paginationQuery.isAscending == 'true' ? 'ASC' : 'DESC',
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

  async removeUnusedBooking() {
    const existingData = await this.bookingRepository
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
      });

    console.log(new Date().getTime().toString())
    console.log(existingData)
    if (existingData.length > 0) {
      const packageIds = [...new Set(existingData.map(x => x.package.id))];
      for (const packageId of packageIds) {
        const totalBooked = existingData.filter(x => x.package.id == packageId).length;
        const pack = existingData.find(x => x.package.id == packageId)?.package;
        if (pack) {
          const stock: ManagePackageStockDto = {
            totalQty: pack.totalQty + totalBooked,
            reservedQty: pack.reservedQty - totalBooked,
          };
          if (stock.reservedQty < 0)
            stock.reservedQty = 0;

          await this.packageRepository.update(pack.id, stock);
        }
      }

      await this.bookingRepository.delete(existingData.map((x) => x.id));
    }
  }

  async completeBooking(id: number, dto: CompleteBookingDto) {
    const isDuplicateCode = await this.bookingRepository.existsBy({
      confirmationCode: dto.confirmationCode,
    });
    if (isDuplicateCode)
      throw new HttpException(
        `Invalid confirmation code.`,
        HttpStatus.BAD_REQUEST,
      );

    const response = await this.bookingRepository.findOne({
      relations: {
        package: { event: { instructors: true } },
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
      if (pack.packagePrice < dto.bookingMoney)
        throw new HttpException(`Booking money can't greater than package price.`, HttpStatus.BAD_REQUEST);

      if (pack) {
        const stock: CompletePackageStockDto = {
          bookedQty: pack.bookedQty + 1,
          reservedQty: pack.reservedQty - 1,
        };

        if (stock.reservedQty < 0)
          stock.reservedQty = 0;

        await this.packageRepository.update(pack.id, stock);
      }

      this.mailService.sendEmailwithTemplate(
        response.email,
        './booking',
        'Package Booking Information',
        {
          logoUrl: "https://muslimcouplesretreat.com/assets/images/logo.png",
          eventName: pack.event.eventName,
          // eventDateRange: `${dateFormat(pack.event.startDate, "longDate")} - ${dateFormat(pack.event.endDate, "longDate")}`,
          eventDateRange: `${pack.event.endDate} - ${pack.event.startDate}`,
          slogan: pack.event.slogan,
          bannerUrl: pack.event.bannerUrl,
          bookingAmount: "$" + response.bookingMoney,
          confirmationCode: response.confirmationCode,
          instructors: pack.event.instructors,
          receiver: {
            name: response.firstName + " " + response.lastName,
            email: response.email
          },
          package: {
            roomName: pack.roomName??"",
            packageName: pack.packageName,
            isSinglePackage: pack.packageType == PACKAGE_TYPE.SINGLE ? true : false,
            packagePerson: pack.packagePerson,
            packagedays: this.dateDiffInDays(pack.event.endDate, pack.event.startDate),
            packagePrice: "$" + pack.packagePrice,
            roomFeatures: pack.roomFeatures,
            houseFeatures: pack.houseFeatures,
            houseFeatureNote: pack.houseFeatureNote,
            packageDealNote: pack.packageDealNote,
            highlightFeatures: JSON.parse(pack.highlightFeatures),
            packageDeal: JSON.parse(pack.packageDeal).map(x => ({ ...x, hasChildren: x.child.length > 0 })),
          }

        }
      );

      return this.bookingRepository.update(id, {
        transactionMethod: dto.transactionMethod,
        confirmationCode: dto.confirmationCode,
        bookingStatus: BOOKING_STATUS.BOOKED,
        bookingMoney: dto.bookingMoney,
      });
    }
    throw new HttpException(`Booking data not found.`, HttpStatus.BAD_REQUEST);
  }

  dateDiffInDays(a, b) {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    // Discard the time and time-zone information.
    const date1 = new Date(a);
    const date2 = new Date(b);
    const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());

    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
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
        await this.packageRepository.update(pack.id, stock);
      }

      this.mailService.sendEmailwithTemplate(
        response.email,
        './confirmation',
        'Package Confirmation',
        {
          name: response.firstName + ' ' + response.lastName,
          packageName: pack.packageName,
          roomName: pack.roomName,
        },
      );

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
          bookedQty: pack.bookedQty - 1,
        };
        await this.packageRepository.update(pack.id, stock);
      }

      return this.bookingRepository.update(id, {
        bookingStatus: BOOKING_STATUS.CANCELLED,
      });
    }
    throw new HttpException(`Booking data not found.`, HttpStatus.BAD_REQUEST);
  }

  async refundBooking(id: number) {
    const response = await this.bookingRepository.findOne({
      relations: {
        package: true,
      },
      where: [
        {
          id: id,
          bookingStatus: Equal(BOOKING_STATUS.CONFIRMED),
        },
      ],
    });

    if (response) {
      const pack = response.package;
      if (pack) {
        const stock: RefundPackageStockDto = {
          totalQty: pack.totalQty + 1,
          confirmedQty: pack.confirmedQty - 1,
        };
        await this.packageRepository.update(pack.id, stock);
      }

      return this.bookingRepository.update(id, {
        bookingStatus: BOOKING_STATUS.REFUNDED,
      });
    }
    throw new HttpException(`Booking data not found.`, HttpStatus.BAD_REQUEST);
  }

  remove(id: number) {
    return this.bookingRepository.delete(id);
  }
}
