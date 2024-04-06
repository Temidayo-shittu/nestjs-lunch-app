import { Controller, Get, UseGuards, Param, Request, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { User } from '../schemas/user.schema';
import { checkPermissions } from 'src/utils/check-permissions';
//import { User } from 'src/types/user';

@Controller('user')
export class UserController {
    constructor(private readonly userService:UserService){}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Get('')
    async getAllUsers(){
        return await this.userService.getAllUsers()
    }  


    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.User, Role.Admin)
    @Get('/:userId')
    async getUser(@Param('userId') userId:string, @Request() req) : Promise<User>{
        const user = await this.userService.findById(userId);
        const hasAdminRole = req.user.roles.includes(Role.Admin);
        console.log(user.email, req.user.email, hasAdminRole);

        if (user.email !== req.user.email && !hasAdminRole) throw new HttpException('You do not have permission to retrieve user information', HttpStatus.UNAUTHORIZED)
        return user;
    }


}
