/* eslint-disable prettier/prettier */
import { Injectable, Request,  HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from 'src/auth/enums/role.enum';
import { CartDto } from 'src/dto/create-cart-dto';
import { RestaurantService } from 'src/restaurant/restaurant.service';
import { Cart, CartDocument } from 'src/schemas/cart.schema';
import { UserService } from 'src/user/user.service';
import { ApiFeatures } from 'src/utils/api-feature';
//import { checkPermissions } from 'src/utils/check-permissions';

@Injectable()
export class CartService {
    constructor(@InjectModel('Cart') private readonly cartModel:Model<CartDocument>,
                                           private readonly userService: UserService,
                                           private readonly restaurantService: RestaurantService){}

    async createCart(cartDto:CartDto, @Request() req) : Promise<Cart>{
        const userId = req.user.id;
        const validUser = await this.userService.findById(userId)
        //console.log(validUser)
        if(!validUser) throw new HttpException('User with the given ID not found', HttpStatus.NOT_FOUND);
        const { restaurant, menu_index, quantity } = cartDto;
        const validRestaurant = await this.restaurantService.findById(restaurant)
        if(!validRestaurant) throw new HttpException('Restaurant with the given ID not found', HttpStatus.NOT_FOUND);
        if(menu_index > validRestaurant.menu.length - 1) throw new HttpException(`Menu index exceeds the maximum array index of valid restaurant menu which is ${validRestaurant.menu.length - 1}!!`, HttpStatus.BAD_REQUEST);
        if(quantity > validRestaurant.menu[menu_index].stock_quantity) throw new HttpException(`Number of plates requested for, exceeds the stock quantity available which is ${validRestaurant.menu[menu_index].stock_quantity}!!`, HttpStatus.BAD_REQUEST); 
        const cart = new this.cartModel(cartDto)
        cart.user = userId;
        cart.food_name = validRestaurant.menu[menu_index].food_name;
        cart.price = validRestaurant.menu[menu_index].price * quantity;
        await cart.save()
        return cart;
        
}

    async getAll(queryStry: any, @Request() req): Promise<any> {
        const totalCartCount = await this.cartModel.countDocuments();
        const resultPerPage = parseInt(req.query.limit) || totalCartCount;
        const page = parseInt(req.query.page) || 1;

        const query = this.cartModel.find({}).populate({path:'restaurant', select:'name description location email'})
                                           .populate({path:'user',select:'username email'}); 

        const apiFeatures = new ApiFeatures<CartDocument>(query, queryStry);

        apiFeatures.search().filter().pagination(resultPerPage); 

        const carts = await apiFeatures.executeQuery();

        const filteredCartCount = carts.length;

        if (carts.length === 0) {
         throw new HttpException('No Carts found', HttpStatus.NOT_FOUND);
  }

  return {
    data: carts,
    totalCartCount,
    filteredCartCount,
    page,
    resultPerPage,
  };
}

    async findById(id: string, @Request() req): Promise<Cart | undefined> {
    const cart = await this.cartModel.findOne({_id:id}).populate({path:'restaurant', select:'name description location email'})
                                                       .populate({path:'user',select:'username email'}).exec();

    if(!cart) throw new HttpException('Cart with the given ID not found', HttpStatus.NOT_FOUND);
    console.log(req.user.email, req.user.roles, cart.user.email);
    const hasAdminRole = req.user.roles.includes(Role.Admin);

    if (cart.user.email !== req.user.email && !hasAdminRole) throw new HttpException('You do not have permission to access this cart', HttpStatus.UNAUTHORIZED)
    return cart;
  }

    async currentUser(@Request() req): Promise<Cart[] | undefined> {
    const cart = await this.cartModel.find({user:req.user.id}).populate({path:'restaurant', select:'name description location email'})
                                                              .populate({path:'user',select:'username email'}).exec();

    if(!cart || cart.length === 0) throw new HttpException('No Cart has been placed by this current user', HttpStatus.NOT_FOUND);
    return cart;
  }

    async update(id: string, @Request() req): Promise<Cart | undefined> {
    const { quantity, restaurant:restaurantId, menu_index } = req.body
    if(!restaurantId || !menu_index) throw new HttpException('Please provide the required restaurantId and menu_index', HttpStatus.BAD_REQUEST);
    const validRestaurant = await this.restaurantService.findById(restaurantId)
    if(!validRestaurant) throw new HttpException('Restaurant with the given ID not found', HttpStatus.NOT_FOUND);

    const cart = await this.cartModel.findOne({_id:id}).populate({path:'restaurant', select:'name description location email'})
                                                       .populate({path:'user',select:'username email'}).exec();
    if(!cart) throw new HttpException('Cart with the given ID not found', HttpStatus.NOT_FOUND);
    console.log(req.user.email, cart.user.email);
    if(cart.user.email !== req.user.email) throw new HttpException('You do not have permission to update this cart', HttpStatus.UNAUTHORIZED)
    if(menu_index > validRestaurant.menu.length - 1) throw new HttpException(`Menu index exceeds the maximum array index of valid restaurant menu which is ${validRestaurant.menu.length - 1}!!`, HttpStatus.BAD_REQUEST);
    if(quantity > validRestaurant.menu[menu_index].stock_quantity) throw new HttpException(`Number of plates requested for, exceeds the stock quantity available which is ${validRestaurant.menu[menu_index].stock_quantity}!!`, HttpStatus.BAD_REQUEST); 
    cart.menu_index = menu_index;
    cart.quantity = quantity;
    cart.food_name = validRestaurant.menu[menu_index].food_name;
    cart.price = validRestaurant.menu[menu_index].price * quantity;
    await cart.save()
    return cart;
  }

    async delete(id: string, @Request() req): Promise<any> {
    const cart = await this.cartModel.findOne({_id:id}).populate({path:'user',select:'username email'});
    if(!cart) throw new HttpException('Cart with the given ID not found', HttpStatus.NOT_FOUND);
    console.log(req.user.email, cart.user.email)
    //checkPermissions(req.user, cart.user)
    if(cart.user.email !== req.user.email) throw new HttpException('You do not have permission to delete this cart', HttpStatus.UNAUTHORIZED);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const deletedCart = await this.cartModel.findByIdAndDelete(id);
    return {msg:"Cart Item successfully deleted"};
  }

}
