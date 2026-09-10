import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';
import { OrderItem } from './entity/orderItem.entity';
import { Product } from '../products/entity/products.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Product])
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
