// create-user.dto.ts

import { IsEmail, IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';
import { Role } from 'src/auth/enums/role.enum';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  mobile: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  location: string;

  @IsNotEmpty()
  roles: Role
}
