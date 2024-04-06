import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Role } from 'src/auth/enums/role.enum';
import { User } from './user.schema';


export type RestaurantDocument = Restaurant & Document;

@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })

export class Restaurant {
    @Prop()
    name: string;
  
    @Prop()
    description: string;
  
    @Prop()
    location: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop()
    mobile: string;
  
    @Prop({ default: true })
    isOpen: boolean;

    @Prop()
    menu: MenuItem[]

    @Prop()
    note: string;

    @Prop({ type: Types.ObjectId, ref: 'User' }) // Reference to User
    owner: User;
  
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);

export interface MenuItem {
    food_name: string;
    stock_quantity: number;
    price: number;
    description: string;
    image_url: string;
  }







