import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RestaurantSchema } from 'src/schemas/restaurant.schema';
import { UserModule } from 'src/user/user.module';
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Restaurant', schema: RestaurantSchema }]),
    UserModule,
  ],
  controllers: [RestaurantController],
  providers: [RestaurantService],
  exports: [RestaurantService]
})
export class RestaurantModule {}
