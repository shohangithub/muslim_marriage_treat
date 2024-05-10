import { IsNotEmpty } from "class-validator";

export class CreateUserDto {
  
//     @ApiProperty()
  @IsNotEmpty()
  firstName: string;

//   @ApiProperty()
  @IsNotEmpty()
  lastName: string;

//   @ApiProperty()
  @IsNotEmpty()
  email: string;

//   @ApiProperty()
//   @IsNotEmpty()
  phone: string;

//   @ApiProperty()
//   @IsNotEmpty()
  password: string;
}
