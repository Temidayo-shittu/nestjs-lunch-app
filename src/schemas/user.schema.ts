import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from 'src/auth/enums/role.enum';
import * as bcrypt from 'bcrypt';


export type UserDocument = User & Document;

@Schema()

export class User {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, unique: true })
  mobile: string;

  @Prop({ required: true, message:["Please input your house address where you want the order to be delivered"] })
  location: string;

  @Prop()
  roles: Role[];
    toObject: any;
}

export const UserSchema = SchemaFactory.createForClass(User);

/*
export const UserSchema=new mongoose.Schema({
  username:{
    type:String,
    required:true
  },
  email:{
    type:String,
    unique:true,
    required:true
  },
  password:{
    type:String,
    required:true
  },
  mobile:{
    type:String,
    required:true
  },
  location:{
    type:String,
    required:true,
    message:["Please input your house address where you want the order to be delivered"]
  },
  roles: Role

})

UserSchema.pre('save',async function(){
  if(!this.isModified('password')) return
  const salt= await bcrypt.genSalt(10)
  this.password= await bcrypt.hash(this.password,salt)
})
*/





