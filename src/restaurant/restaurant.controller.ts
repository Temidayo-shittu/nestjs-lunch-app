/* eslint-disable prettier/prettier */
import { Controller, UseGuards, Request, Post, Get, Param, Body } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RestaurantDto } from 'src/dto/create-restaurant-dto';
import { Restaurant } from 'src/schemas/restaurant.schema';
import { RestaurantService } from './restaurant.service';

@Controller('restaurant')
export class RestaurantController {
    constructor(private readonly restaurantService:RestaurantService){}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Post('')
    async createNewRestaurant(@Body() restaurantDto:RestaurantDto, @Request() req){
        return await this.restaurantService.createRestaurant(restaurantDto, req)
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.User, Role.Admin)
    @Get('')
    async getAllRestaurants(@Request() req) {
        const queryStry = req.query; 
        const result = await this.restaurantService.getAll(queryStry, req);
        return result;
      }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.User)
    @Get('/:id')
    async getSingleRestaurant(@Param('id') id:string) : Promise<Restaurant>{
        return await this.restaurantService.findById(id)
    }
}
