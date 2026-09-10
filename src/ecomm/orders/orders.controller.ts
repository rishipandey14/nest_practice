import { Body, Controller, Post, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './DTO/createOrder.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create( @Req() req: any, @Body() createOrderDto: CreateOrderDto ) {
    return this.ordersService.create(req.user.sub, createOrderDto);
  }
}
