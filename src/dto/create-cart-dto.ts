// create-cart.dto.ts

import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CartDto {

  @IsString()
  @IsNotEmpty()
  user: string;

  @IsString()
  @IsNotEmpty()
  restaurant: string;

  @IsNumber()
  @IsNotEmpty()
  menu_index: number;

  @IsString()
  @IsNotEmpty()
  food_name: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  price: number;

}