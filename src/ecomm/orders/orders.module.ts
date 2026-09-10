import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';
import { OrderItem } from './entity/orderItem.entity';
import { Product } from '../products/entity/products.entity';
import { MailService } from 'src/mail/mail.service';
import { MailModule } from 'src/mail/mail.module';
import { OrderCreatedEmailListener } from './listeners/orderCreatedMail.listener';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Product]),
    MailModule,
  ],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    OrderCreatedEmailListener
  ],
})
export class OrdersModule {}
