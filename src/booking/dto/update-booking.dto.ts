import { PartialType } from '@nestjs/swagger';
import { CreateBookingDto } from './create-booking.dto';
import { TRANS_METHOD } from 'src/utills/enum';
import { IsNotEmpty } from 'class-validator';

export class UpdateBookingDto extends PartialType(CreateBookingDto) {}
export class CompleteBookingDto {
    @IsNotEmpty()
    transactionMethod?: TRANS_METHOD;
    @IsNotEmpty()
    transactionNo?: string;
}

