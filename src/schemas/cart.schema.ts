/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Restaurant } from './restaurant.schema';
import { User } from './user.schema';

export type CartDocument = Cart & Document;

@Schema({ timestamps: true })

export class Cart {

    @Prop({ type: Types.ObjectId, ref: 'User' }) // Reference to User
    user: User;

    @Prop({ type: Types.ObjectId, ref: 'Restaurant' }) // Reference to Restaurant
    restaurant: Restaurant;

    @Prop()
    menu_index: number;

    @Prop()
    food_name: string;
  
    @Prop({ required: true, message: "Please provide number of plates you wish to place in cart"})
    quantity: number;
  
    @Prop()
    price: number;

}

export const CartSchema = SchemaFactory.createForClass(Cart);








