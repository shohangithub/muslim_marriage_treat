import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateAuthDto {}

export class LoginRequestDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  password: string;
}
