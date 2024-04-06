import { Controller, Request, Get, Post, Body, UseGuards, Param, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from 'src/dto/create-user-dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
import { Roles } from './decorators/roles.decorator';
import { Role } from './enums/role.enum';
import { RolesGuard } from './guards/roles.guard';
import { createTokenUser } from 'src/utils/create-token-user';
import { LoginUserDto } from 'src/dto/signin-user-dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private userService: UserService) {}

  @Post('/signup')
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.addNewUser(createUserDto);

    const payload = {
        username: user.username,
        email: user.email,
        roles: user.roles
      };

    const token = await this.authService.signPayload(payload);
      return {
           message: `Welcome to Glovo App!! Successfully Registered ${user.username}`,
           user, 
           token 
        };
  }

  
  @Post('/login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const user = await this.userService.findByLogin(loginUserDto);

    const payload = {
        username: user.username,
        email: user.email,
        roles: user.roles
      };

    const token = await this.authService.signPayload(payload);
      return {
           message: `Welcome to Glovo App!! Successfully Logged In ${user.username}`,
           user, 
           token 
        };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  @Get('/user-profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get('/admin-profile')
  getDashboard(@Request() req) {
    return req.user;
  }
}
