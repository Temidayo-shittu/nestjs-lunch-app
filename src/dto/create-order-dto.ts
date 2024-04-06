// create-user.dto.ts

import { IsEmail, IsNotEmpty, IsNumber, IsString, MinLength, IsBoolean } from 'class-validator';
import { Role } from 'src/auth/enums/role.enum';
import { MenuItem } from 'src/schemas/restaurant.schema';

export class OrderDto {
  @IsString()
  @IsNotEmpty()
  user: string;

  @IsNumber()
  @IsNotEmpty()
  delivery_fee: number;

  @IsNumber()
  @IsNotEmpty()
  sub_total: number;

  @IsNumber()
  @IsNotEmpty()
  total: number;

  @IsNotEmpty()
  orderItems: SingleOrderItemDto[]

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsNotEmpty()
  client_secret: string;

  @IsString()
  @IsNotEmpty()
  payment_intentId: string;

}

export interface SingleOrderItemDto {
   readonly price: number;
   readonly quantity: number;
   readonly cart: string;
  }
