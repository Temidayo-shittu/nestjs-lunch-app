/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })

export class Order {

    @Prop({ type: Types.ObjectId, ref: 'User' }) // Reference to User
    user: User;

    @Prop({ type: Types.ObjectId, ref: 'User' }) // Reference to Admin
    approver: User;

    @Prop()
    delivery_fee: number;

    @Prop()
    sub_total: number;

    @Prop()
    total: number;

    @Prop()
    orderItems: SingleOrderItem[]

    @Prop({  
        enum:['pending','failed','paid','delivered','cancelled'],
        default:'pending'
    })
    status: string;

    @Prop()
    client_secret: string;

    @Prop()
    payment_intentId: string;
  
}

export const OrderSchema = SchemaFactory.createForClass(Order);

export interface SingleOrderItem {
    price: number;
    quantity: number;
    cart: { type: Types.ObjectId, ref: 'Cart' };
  }








