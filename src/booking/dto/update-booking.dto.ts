import { PartialType } from '@nestjs/swagger';
import { CreateBookingDto } from './create-booking.dto';
import { TRANS_METHOD } from 'src/utills/enum';
import { IsEnum, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class UpdateBookingDto extends PartialType(CreateBookingDto) {}
export class CompleteBookingDto {
  @IsNotEmpty()
  @IsEnum(TRANS_METHOD)
  transactionMethod: TRANS_METHOD;

  @IsNumber()
  @Min(1)
  bookingMoney: number;

  @IsNotEmpty()
  confirmationCode?: string;
}
