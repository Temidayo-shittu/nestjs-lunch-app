import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { sign } from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';
import 'dotenv/config'
import { Payload } from 'src/types/payload';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService,
    private readonly jwtService: JwtService) {}

    async signPayload(payload: Payload) {
        return sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME });
      }
      async validateUser(payload: Payload) {
        return await this.userService.findByPayload(payload);
      }
      }
/*
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findUser(email);
    if(!user) throw new NotFoundException("User with the given email not Found")
    const isPasswordMatch = await bcrypt.compare(
      password,
      user.password
    );
    if(!isPasswordMatch) throw new NotFoundException("Password Not Valid!!Please try again")
   // const tokenUser= createTokenUser(user)
   // console.log(tokenUser)
    //const token = generateToken({ username, roles:Role });
    
    return { user };
  }

  async login(user: any) {
    const tokenUser= createTokenUser(user)
    console.log(tokenUser)
    return {
        message: `Successfully Logged In User`,
        tokenUser,
        access_token: this.jwtService.sign(tokenUser),
      };
      /*
    const payload = { username: user.username, email: user.email, sub: user._id, roles: user.roles };
    */
  
  



