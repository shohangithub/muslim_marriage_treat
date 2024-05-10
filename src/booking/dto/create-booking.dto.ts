import { IsNotEmpty } from "class-validator";
import { BOOKING_STATUS, TRANS_METHOD } from "src/utills/enum";

export class CreateBookingDto {
    transactionMethod?: TRANS_METHOD;
    transactionNo?: string;
    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    lastName: string;

    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    phone: string;
    bookedFrom: string;
    bookingStatus: BOOKING_STATUS;
}
