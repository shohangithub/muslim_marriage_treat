import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber } from "class-validator";
import { Package } from "src/package/entities/package.entity";

export class CreateBookingDto {
    
    @IsOptional()
    transactionNumber?:string;

    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    lastName: string;

    @IsNotEmpty()
    spouseFirstName: string;
  
    @IsNotEmpty()
    spouseLastName: string;
  

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsPhoneNumber('US')
    phone: string;
    bookedFrom: string;
    //expireTime!: string;
    // @IsEnum(BOOKING_STATUS)
    // bookingStatus: BOOKING_STATUS;
    @IsNotEmpty()
    package: Package;
}
