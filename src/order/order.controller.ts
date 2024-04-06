import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { OrderDto } from 'src/dto/create-order-dto';
import { Order } from 'src/schemas/order.schema';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
    constructor(private readonly orderService:OrderService){}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.User)
    @Post('')
    async createNewOrder(@Body() orderDto:OrderDto, @Request() req){
        return await this.orderService.createOrder(orderDto, req)
    };

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Get('')
    async getAllOrders(@Request() req) {
        const queryStry = req.query; 
        const result = await this.orderService.getAll(queryStry, req);
        return result;
      };

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.User, Role.Admin)
    @Get('/:id')
    async getSingleOrder(@Param('id') id:string, @Request() req) : Promise<Order>{
        return await this.orderService.findById(id,req)
    };

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.User, Role.Admin)
    @Get('/show/current-order')
    async getCurrentOrderUser(@Request() req) : Promise<Order[] | any>{
        return await this.orderService.currentUser(req)
    };

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Put('/:id')
    async approve(@Param('id') id:string, @Request() req) : Promise<Order>{
        return await this.orderService.approveOrder(id,req)
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.User, Role.Admin)
    @Delete('/:id')
    async deleteOrder(@Param('id') id:string, @Request() req) : Promise<any>{
        return await this.orderService.delete(id,req)
    };
};
