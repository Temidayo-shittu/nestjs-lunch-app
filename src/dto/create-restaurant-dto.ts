// create-user.dto.ts

import { IsEmail, IsNotEmpty, IsNumber, IsString, MinLength, IsBoolean } from 'class-validator';
import { Role } from 'src/auth/enums/role.enum';
import { MenuItem } from 'src/schemas/restaurant.schema';

export class RestaurantDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  mobile: string;

  @IsBoolean()
  @IsNotEmpty()
  isOpen: boolean;

  @IsNotEmpty()
  menu: MenuItemDto[]

  @IsString()
  @IsNotEmpty()
  note: string;

  @IsString()
  @IsNotEmpty()
  owner: string;

}

export interface MenuItemDto {
   readonly food_name: string;
   readonly stock_quantity: number;
   readonly price: number;
   readonly description: string;
   readonly image_url: string;
  }
