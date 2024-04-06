import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from '../dto/create-user-dto';
import * as bcrypt from 'bcrypt';
import 'dotenv/config'
import { LoginUserDto } from '../dto/signin-user-dto';
import { Payload } from 'src/types/payload';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UserService {
    constructor(@InjectModel('User') private readonly userModel:Model<UserDocument>){}

    async addNewUser(createUserDto: CreateUserDto): Promise<User> {
        const { email } = createUserDto;
        const user = await this.userModel.findOne({ email });
        if (user) {
          throw new HttpException('user already exists', HttpStatus.BAD_REQUEST);
        }
        const createdUser = new this.userModel(createUserDto);
        createdUser.password = await bcrypt.hash(createdUser.password, 10);
        await createdUser.save();
        return this.sanitizeUser(createdUser);
      }
      
    async findUser(email: string): Promise<User | undefined> {
        const user = await this.userModel.findOne({email: email});
        return user;
      }

    async findById(id: string): Promise<User | undefined> {
        const user = await this.userModel.findOne({_id:id}).select('-password');
        if(!user) throw new NotFoundException("User with the given ID not Found")
        return user;
      }

      async findByPayload(payload: Payload) {
        const { email } = payload;
        return await this.userModel.findOne({ email });
      }
      
      async findByLogin(loginUserDto: LoginUserDto) {
        const { email, password } = loginUserDto;
        const user = await this.userModel.findOne({ email });
        if (!user) {
          throw new HttpException('user doesnt exists', HttpStatus.BAD_REQUEST);
        }
        if (await bcrypt.compare(password, user.password)) {
          return this.sanitizeUser(user)
        } else {
          throw new HttpException('invalid credential', HttpStatus.BAD_REQUEST);
        }
      }

      async getAllUsers(): Promise<User[]> {
        return this.userModel.find({}).select('-password').exec();
      }

      sanitizeUser(user: User) {
        const sanitized = user.toObject();
        delete sanitized['password'];
        return sanitized;
      }

}




/*
    async addNewUser(createUserDto: CreateUserDto): Promise<User> {
    const { email } = createUserDto;
    console.log(email)
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
    const token = generateToken({ email, roles:Role });
    console.log(token)
    const verificationLink = `http://localhost:3000/users/verify/${token}`;
    console.log(verificationLink)
    await this.mailService.sendMail(
      process.env.EMAIL_USERNAME,
      email,
      'Verify your email',
      `Click on this link to verify your email: ${verificationLink}`,
    );

    const user = await this.userModel.create(createUserDto);
    user.emailVerificationToken = token;
    user.password = await bcrypt.hash(user.password, 10);
    return user.save();
      }

    async verifyEmail(token: string) {
        const payload = verifyToken(token);
        if (!payload) {
          throw new NotFoundException('Invalid token');
        }
        const user = await this.userModel.findOne({ email: payload.email });
        if (!user) {
          throw new NotFoundException('User not found');
        }
        user.isEmailVerified = true;
        user.emailVerificationToken = null;
    
        await user.save();
      }
      */