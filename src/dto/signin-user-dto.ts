// signin-user.dto.ts

import { IsEmail, IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';
import { Role } from 'src/auth/enums/role.enum';

export class LoginUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

}
