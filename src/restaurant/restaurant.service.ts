/* eslint-disable prettier/prettier */
import { Injectable, Request, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RestaurantDto } from 'src/dto/create-restaurant-dto';
import { Restaurant, RestaurantDocument } from 'src/schemas/restaurant.schema';
import { UserService } from 'src/user/user.service';
import { ApiFeatures } from 'src/utils/api-feature';

@Injectable()
export class RestaurantService {
    constructor(@InjectModel('Restaurant') private readonly restaurantModel:Model<RestaurantDocument>,
                                           private readonly userService: UserService){}


    async createRestaurant(restaurantDto:RestaurantDto, @Request() req) : Promise<Restaurant>{
        const ownerId = req.user.id;
        const validOwner = await this.userService.findById(ownerId)
        console.log(validOwner)
        if(!validOwner) throw new HttpException('User with the given ID not found', HttpStatus.NOT_FOUND);
        const restaurant = new this.restaurantModel(restaurantDto)
        restaurant.owner = ownerId;
        await restaurant.save()
        return restaurant;
    }

    async getAll(queryStry: any, @Request() req): Promise<any> {
        const totalRestaurantCount = await this.restaurantModel.countDocuments();
        const resultPerPage = parseInt(req.query.limit) || totalRestaurantCount;
        const page = parseInt(req.query.page) || 1;
      
        const query = this.restaurantModel.find({}); 
      
        const apiFeatures = new ApiFeatures<RestaurantDocument>(query, queryStry);
      
        apiFeatures.search().filter().pagination(resultPerPage); 
      
        const restaurants = await apiFeatures.executeQuery();
      
        const filteredRestaurantCount = restaurants.length;
      
        if (restaurants.length === 0) {
          throw new HttpException('No Restaurants found', HttpStatus.NOT_FOUND);
        }
      
        return {
          data: restaurants,
          totalRestaurantCount,
          filteredRestaurantCount,
          page,
          resultPerPage,
        };
      }
      

    async findById(id: string): Promise<Restaurant | undefined> {
        const restaurant = await this.restaurantModel.findOne({_id:id});
        if(!restaurant) throw new HttpException('Restaurant with the given ID not found', HttpStatus.NOT_FOUND);
        return restaurant;
      }
}
