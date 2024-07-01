import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CompleteBookingDto, UpdateBookingDto } from './dto/update-booking.dto';
import { Booking } from './entities/booking.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, LessThan, Repository } from 'typeorm';
import { BOOKING_STATUS, PACKAGE_TYPE } from 'src/utills/enum';
import {
  CancelPackageStockDto,
  CompletePackageStockDto,
  ConfirmPackageStockDto,
  ManagePackageStockDto,
  RefundPackageStockDto,
} from 'src/package/dto/update-package.dto';
import { MailService } from 'src/mail/mail.service';
import { Package } from 'src/package/entities/package.entity';
import { Utils } from 'src/utills/extension';
import { BookingQueryDto } from './dto/booking-query.dto';

@Injectable()
export class BookingService {
  readonly bookingExpireTime = process.env.BOOKING_EXPIRE_TIME;
  readonly admin_email_address = process.env.ADMIN_EMAIL;
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(Package)
    private readonly packageRepository: Repository<Package>,
    private readonly mailService: MailService,
  ) {}

  async create(createBookingDto: CreateBookingDto) {
    const res = await this.packageRepository.findOne({
      relations: { event: true },
      where: { id: createBookingDto.package.id },
    });

    if (res) {
      if (res.totalQty > 0) {
        // createBookingDto.transactionNumber = uuid();
        createBookingDto.bookedTime = new Date().getTime().toString();
        createBookingDto.expireTime = Utils.getExpireTime(
          this.bookingExpireTime,
        );

        const result = await this.bookingRepository.save(createBookingDto);

        //#region UPDATE SAME QUANTITY

        if (res.packageType == PACKAGE_TYPE.SINGLE) {
          const samePackage = await this.packageRepository.findOne({
            where: {
              packageType: PACKAGE_TYPE.THREEDAYS,
              event: { id: res.event.id },
            },
          });
          if (samePackage) {
            const stock: ManagePackageStockDto = {
              totalQty: samePackage.totalQty - 1,
              reservedQty: samePackage.reservedQty + 1,
            };
            await this.packageRepository.update(samePackage.id, stock);
          }
        } else if (res.packageType == PACKAGE_TYPE.THREEDAYS) {
          const samePackage = await this.packageRepository.findOne({
            where: {
              packageType: PACKAGE_TYPE.SINGLE,
              event: { id: res.event.id },
            },
          });
          if (samePackage) {
            const stock: ManagePackageStockDto = {
              totalQty: samePackage.totalQty - 1,
              reservedQty: samePackage.reservedQty + 1,
            };
            await this.packageRepository.update(samePackage.id, stock);
          }
        }

        //#endregion

        const stock: ManagePackageStockDto = {
          totalQty: res.totalQty - 1,
          reservedQty: res.reservedQty + 1,
        };
        await this.packageRepository.update(res.id, stock);
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
        throw new HttpException(`An error occured.`, HttpStatus.BAD_REQUEST);
      }
    }
    throw new HttpException(`Package not found.`, HttpStatus.BAD_REQUEST);
  }

  async pagination(paginationQuery: BookingQueryDto) {
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
      .innerJoinAndSelect('booking.package', 'package')
      .innerJoinAndSelect('package.event', 'event')
      .where('booking.bookingStatus <> :status', {
        status: BOOKING_STATUS.RESERVED,
      });

    if (paginationQuery.eventId) {
      query.andWhere('event.id = :eventId', {
        eventId: paginationQuery.eventId,
      });
    }

    if (paginationQuery.openText) {
      query.andWhere(
        '(LOWER(booking.firstName) LIKE LOWER(:name) OR LOWER(booking.lastName) LIKE LOWER(:name) OR LOWER(booking.confirmationCode) LIKE LOWER(:name) OR LOWER(CONCAT(booking.firstName, booking.lastName)) LIKE LOWER(:name) OR LOWER(CONCAT(booking.firstName," ", booking.lastName)) LIKE LOWER(:name) OR LOWER(package.packageName) LIKE LOWER(:name) OR LOWER(booking.transactionNumber) LIKE LOWER(:name) OR LOWER(CONCAT(booking.spouseFirstName, booking.spouseLastName)) LIKE LOWER(:name) OR LOWER(CONCAT(booking.spouseFirstName," ", booking.spouseLastName)) LIKE LOWER(:name) OR LOWER(booking.phone) LIKE LOWER(:name)  OR LOWER(booking.email) LIKE LOWER(:name) )',
        {
          name: `%${paginationQuery.openText}%`,
        },
      );
    }

    const totalCount = await query.getCount();
    const data = await query
      .orderBy(
        'booking.bookedTime',
        paginationQuery.isAscending == 'true' ? 'ASC' : 'DESC',
      )
      .skip(paginationQuery.pageIndex * paginationQuery.pageSize)
      .take(paginationQuery.pageSize)
      .select([
        'booking.id',
        'booking.transactionMethod',
        'booking.transactionNumber',
        'booking.confirmationCode',
        'booking.firstName',
        'booking.lastName',
        'booking.spouseFirstName',
        'booking.spouseLastName',
        'booking.bookingStatus',
        'booking.bookingMoney',
        'booking.bookedTime',
        'booking.phone',
        'booking.email',
        'package.packageName',
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
    const existingData = await this.bookingRepository.find({
      relations: {
        package: { event: true },
      },
      where: {
        expireTime: LessThan(new Date().getTime().toString()),
        bookingStatus: Equal(BOOKING_STATUS.RESERVED),
      },
    });

    if (existingData.length > 0) {
      const packageIds = [...new Set(existingData.map((x) => x.package.id))];
      for (const packageId of packageIds) {
        const totalBooked = existingData.filter(
          (x) => x.package.id == packageId,
        ).length;
        const pack = existingData.find(
          (x) => x.package.id == packageId,
        )?.package;
        if (pack) {
          const stock: ManagePackageStockDto = {
            totalQty: pack.totalQty + totalBooked,
            reservedQty: pack.reservedQty - totalBooked,
          };

          //#region UPDATE SAME QUANTITY

          if (pack.packageType == PACKAGE_TYPE.SINGLE) {
            const samePackage = await this.packageRepository.findOne({
              where: {
                packageType: PACKAGE_TYPE.THREEDAYS,
                event: { id: pack.event.id },
              },
            });

            if (samePackage) {
              const stock: ManagePackageStockDto = {
                totalQty: samePackage.totalQty + totalBooked,
                reservedQty: samePackage.reservedQty - totalBooked,
              };
              if (stock.reservedQty < 0) stock.reservedQty = 0;
              await this.packageRepository.update(samePackage.id, stock);
            }
          } else if (pack.packageType == PACKAGE_TYPE.THREEDAYS) {
            const samePackage = await this.packageRepository.findOne({
              where: {
                packageType: PACKAGE_TYPE.SINGLE,
                event: { id: pack.event.id },
              },
            });

            if (samePackage) {
              const stock: ManagePackageStockDto = {
                totalQty: samePackage.totalQty + totalBooked,
                reservedQty: samePackage.reservedQty - totalBooked,
              };
              if (stock.reservedQty < 0) stock.reservedQty = 0;
              await this.packageRepository.update(samePackage.id, stock);
            }
          }

          //#endregion

          if (stock.reservedQty < 0) stock.reservedQty = 0;

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
        `This confirmation number is already used.`,
        HttpStatus.BAD_REQUEST,
      );

    const response = await this.bookingRepository.findOne({
      relations: {
        package: { event: { instructors: true } },
      },
      where: {
        id: id,
        bookingStatus: Equal(BOOKING_STATUS.RESERVED),
      },
    });

    if (response) {
      const pack = response.package;
      if (pack.packagePrice < dto.bookingMoney)
        throw new HttpException(
          `Booking money can't greater than package price.`,
          HttpStatus.BAD_REQUEST,
        );

      if (pack) {
        const stock: CompletePackageStockDto = {
          bookedQty: pack.bookedQty + 1,
          reservedQty: pack.reservedQty - 1,
        };

        //#region UPDATE SAME QUANTITY

        if (pack.packageType == PACKAGE_TYPE.SINGLE) {
          const samePackage = await this.packageRepository.findOne({
            where: {
              packageType: PACKAGE_TYPE.THREEDAYS,
              event: { id: pack.event.id },
            },
          });

          if (samePackage) {
            const stock: CompletePackageStockDto = {
              bookedQty: samePackage.bookedQty + 1,
              reservedQty: samePackage.reservedQty - 1,
            };
            if (stock.reservedQty < 0) stock.reservedQty = 0;
            await this.packageRepository.update(samePackage.id, stock);
          }
        } else if (pack.packageType == PACKAGE_TYPE.THREEDAYS) {
          const samePackage = await this.packageRepository.findOne({
            where: {
              packageType: PACKAGE_TYPE.SINGLE,
              event: { id: pack.event.id },
            },
          });

          if (samePackage) {
            const stock: CompletePackageStockDto = {
              bookedQty: samePackage.bookedQty + 1,
              reservedQty: samePackage.reservedQty - 1,
            };
            if (stock.reservedQty < 0) stock.reservedQty = 0;
            await this.packageRepository.update(samePackage.id, stock);
          }
        }

        //#endregion

        if (stock.reservedQty < 0) stock.reservedQty = 0;

        await this.packageRepository.update(pack.id, stock);
      }
      const weekdays = Utils.getWeekDays(
        pack.event.startDate,
        pack.event.endDate,
      );
      const dates = Utils.getDays(pack.event.startDate,pack.event.endDate);

      const templateData = {
        logoUrl: 'https://muslimcouplesretreat.com/assets/images/logo.png',
        eventName: pack.event.eventName,
        eventId: pack.event.id,
        // eventDateRange: `${dateFormat(pack.event.startDate, "longDate")} - ${dateFormat(pack.event.endDate, "longDate")}`,
        eventDateRange: Utils.formattedDateRange(
          pack.event.startDate.toString(),
          pack.event.endDate.toString(),
        ),
        slogan: pack.event.slogan,
        bannerUrl: pack.event.bannerUrl,
        bookingAmount: '$' + dto.bookingMoney,
        confirmationCode: dto.confirmationCode,
        instructors: pack.event.instructors,
        receiver: {
          name: response.firstName + ' ' + response.lastName,
          email: response.email,
        },
        package: {
          roomName: pack.roomName ?? '',
          packageName: pack.packageName,
          isSinglePackage: pack.packageType == PACKAGE_TYPE.SINGLE || pack.packageType == PACKAGE_TYPE.THREEDAYS ? true: false,
          ondayPackage:  pack.packageType == PACKAGE_TYPE.SINGLE ? true : false,
          packagePerson: pack.packagePerson,
          packagedays: Utils.dateDiffInDays(
            pack.event.startDate,
            pack.event.endDate,
          ),
          singleDate: dates[1]??"",
          singleWeekday: weekdays[1]??"",
          packagePrice: '$' + pack.packagePrice,
          roomFeatures:
            pack.roomFeatures?.replace(/(<p[^>]+?>|<p>|<\/p>)/gim, '') || '',
          houseFeatures:
            pack?.houseFeatures?.replace(/(<p[^>]+?>|<p>|<\/p>)/gim, '') || '',
          houseFeatureNote: pack.houseFeatureNote,
          packageDealNote: pack.packageDealNote,
          highlightFeatures: JSON.parse(pack.highlightFeatures),
          packageDeal: JSON.parse(pack.packageDeal).map((x) => ({
            ...x,
            hasChildren: x.child.length > 0,
          })),
        },
      };
      const templateURL =
        pack.packageType == PACKAGE_TYPE.SINGLE
          ? './booking_single_package'
          : pack.packageType == PACKAGE_TYPE.THREEDAYS
            ? './booking_threedays_package'
            : './booking';
      this.mailService.sendEmailwithTemplate(
        response.email,
        templateURL,
        'Package Booking Information',
        templateData,
      );

      this.mailService.sendEmailwithTemplate(
        this.admin_email_address,
        './admin-booking',
        'Package Booking Information',
        templateData,
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

  async confirmBooking(id: number) {
    const response = await this.bookingRepository.findOne({
      relations: {
        package: { event: { instructors: true } },
      },
      where: {
        id: id,
        bookingStatus: Equal(BOOKING_STATUS.BOOKED),
      },
    });

    if (response) {
      const pack = response.package;
      if (pack) {
        const stock: ConfirmPackageStockDto = {
          bookedQty: pack.bookedQty - 1,
          confirmedQty: pack.confirmedQty + 1,
        };

        //#region UPDATE SAME QUANTITY

        if (pack.packageType == PACKAGE_TYPE.SINGLE) {
          const samePackage = await this.packageRepository.findOne({
            where: {
              packageType: PACKAGE_TYPE.THREEDAYS,
              event: { id: pack.event.id },
            },
          });

          if (samePackage) {
            const stock: ConfirmPackageStockDto = {
              bookedQty: samePackage.bookedQty - 1,
              confirmedQty: samePackage.confirmedQty + 1,
            };
            await this.packageRepository.update(samePackage.id, stock);
          }
        } else if (pack.packageType == PACKAGE_TYPE.THREEDAYS) {
          const samePackage = await this.packageRepository.findOne({
            where: {
              packageType: PACKAGE_TYPE.SINGLE,
              event: { id: pack.event.id },
            },
          });

          if (samePackage) {
            const stock: ConfirmPackageStockDto = {
              bookedQty: samePackage.bookedQty - 1,
              confirmedQty: samePackage.confirmedQty + 1,
            };
            await this.packageRepository.update(samePackage.id, stock);
          }
        }

        //#endregion

        await this.packageRepository.update(pack.id, stock);
      }
      // generate code
      const verifyCode = await this.generateVerifyCode();

      const weekdays = Utils.getWeekDays(
        pack.event.startDate,
        pack.event.endDate,
      );
      const dates = Utils.getDays(pack.event.startDate,pack.event.endDate);


      const templateURL =
        pack.packageType == PACKAGE_TYPE.SINGLE
          ? './confirmation_single_package'
          : pack.packageType == PACKAGE_TYPE.THREEDAYS
            ? './confirmation_threedays_package'
            : './confirmation';
      this.mailService.sendEmailwithTemplate(
        response.email,
        templateURL,
        'Package Confirmation',
        {
          eventName: pack.event.eventName,
          eventDateRange: Utils.formattedDateRange(
            pack.event.startDate.toString(),
            pack.event.endDate.toString(),
          ),
          slogan: pack.event.slogan,
          bannerUrl: pack.event.bannerUrl,
          instructors: pack.event.instructors,
          receiver: {
            name: response.firstName + ' ' + response.lastName,
            email: response.email,
          },
          package: {
            roomName: pack.roomName ?? '',
            packageName: pack.packageName,
            isSinglePackage:
              pack.packageType == PACKAGE_TYPE.SINGLE || pack.packageType == PACKAGE_TYPE.THREEDAYS
                ? true
                : false,
            ondayPackage:  pack.packageType == PACKAGE_TYPE.SINGLE ? true : false,
            packagePerson: pack.packagePerson,
            packagedays: Utils.dateDiffInDays(
              pack.event.startDate,
              pack.event.endDate,
            ),
            singleDate: dates[1]??"",
            singleWeekday: weekdays[1]??"",
            packagePrice: '$' + pack.packagePrice,
            roomFeatures: pack.roomFeatures,
            houseFeatures: pack.houseFeatures,
            houseFeatureNote: pack.houseFeatureNote,
            packageDealNote: pack.packageDealNote,
            highlightFeatures: JSON.parse(pack.highlightFeatures),
            packageDeal: JSON.parse(pack.packageDeal).map((x) => ({
              ...x,
              hasChildren: x.child.length > 0,
            })),
          },
        },
      );

      return this.bookingRepository.update(id, {
        transactionNumber: verifyCode,
        bookingStatus: BOOKING_STATUS.CONFIRMED,
      });
    }
  }

  private async generateVerifyCode(): Promise<string> {
    let verifyCode = '';
    do {
      verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    } while (
      await this.bookingRepository.exists({
        where: { transactionNumber: verifyCode },
      })
    );
    return verifyCode;
  }

  async cancelBooking(id: number) {
    const response = await this.bookingRepository.findOne({
      relations: {
        package: { event: true },
      },
      where: {
        id: id,
        bookingStatus: Equal(BOOKING_STATUS.BOOKED),
      },
    });

    if (response) {
      const pack = response.package;
      if (pack) {
        const stock: CancelPackageStockDto = {
          totalQty: pack.totalQty + 1,
          bookedQty: pack.bookedQty - 1,
        };

        //#region UPDATE SAME QUANTITY

        if (pack.packageType == PACKAGE_TYPE.SINGLE) {
          const samePackage = await this.packageRepository.findOne({
            where: {
              packageType: PACKAGE_TYPE.THREEDAYS,
              event: { id: pack.event.id },
            },
          });

          if (samePackage) {
            const stock: CancelPackageStockDto = {
              totalQty: samePackage.totalQty + 1,
              bookedQty: samePackage.bookedQty - 1,
            };
            await this.packageRepository.update(samePackage.id, stock);
          }
        } else if (pack.packageType == PACKAGE_TYPE.THREEDAYS) {
          const samePackage = await this.packageRepository.findOne({
            where: {
              packageType: PACKAGE_TYPE.SINGLE,
              event: { id: pack.event.id },
            },
          });

          if (samePackage) {
            const stock: CancelPackageStockDto = {
              totalQty: samePackage.totalQty + 1,
              bookedQty: samePackage.bookedQty - 1,
            };
            await this.packageRepository.update(samePackage.id, stock);
          }
        }

        //#endregion

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
      where: {
        id: id,
        bookingStatus: Equal(BOOKING_STATUS.CONFIRMED),
      },
    });

    if (response) {
      const pack = response.package;
      if (pack) {
        const stock: RefundPackageStockDto = {
          totalQty: pack.totalQty + 1,
          confirmedQty: pack.confirmedQty - 1,
        };

        //#region UPDATE SAME QUANTITY

        if (pack.packageType == PACKAGE_TYPE.SINGLE) {
          const samePackage = await this.packageRepository.findOne({
            where: {
              packageType: PACKAGE_TYPE.THREEDAYS,
              event: { id: pack.event.id },
            },
          });

          if (samePackage) {
            const stock: RefundPackageStockDto = {
              totalQty: samePackage.totalQty + 1,
              confirmedQty: samePackage.confirmedQty - 1,
            };
            await this.packageRepository.update(samePackage.id, stock);
          }
        } else if (pack.packageType == PACKAGE_TYPE.THREEDAYS) {
          const samePackage = await this.packageRepository.findOne({
            where: {
              packageType: PACKAGE_TYPE.SINGLE,
              event: { id: pack.event.id },
            },
          });

          if (samePackage) {
            const stock: RefundPackageStockDto = {
              totalQty: samePackage.totalQty + 1,
              confirmedQty: samePackage.confirmedQty - 1,
            };
            await this.packageRepository.update(samePackage.id, stock);
          }
        }

        //#endregion

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
