import { Body, Controller, Post, UseGuards, Request, Get, Param, Put } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CartDto } from 'src/dto/create-cart-dto';
import { Cart } from 'src/schemas/cart.schema';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
    constructor(private readonly cartService:CartService){}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.User)
    @Post('')
    async createNewCart(@Body() cartDto:CartDto, @Request() req){
        return await this.cartService.createCart(cartDto, req)
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Get('')
    async getAllCarts(@Request() req) {
        const queryStry = req.query; 
        const result = await this.cartService.getAll(queryStry, req);
        return result;
      }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.User)
    @Get('/:id')
    async getSingleCart(@Param('id') id:string, @Request() req) : Promise<Cart>{
        return await this.cartService.findById(id,req)
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.User)
    @Get('/show/current-cart')
    async getCurrentCartUser(@Request() req) : Promise<Cart[]>{
        return await this.cartService.currentUser(req)
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.User)
    @Put('/:id')
    async updateCart(@Param('id') id:string, @Request() req) : Promise<Cart>{
        return await this.cartService.update(id,req)
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.User)
    @Get('/:id')
    async deleteCartItem(@Param('id') id:string, @Request() req) : Promise<any>{
        return await this.cartService.delete(id,req)
    }
}
