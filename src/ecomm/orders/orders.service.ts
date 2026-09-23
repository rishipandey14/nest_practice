import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';
import { DataSource } from 'typeorm';
// import { OrderItem } from './entity/orderItem.entity';
// import { Product } from '../products/entity/products.entity';
import { CreateOrderDto } from './DTO/createOrder.dto';
// import { OrderStatus } from './enums/orderStatus.enum';
// import { EventEmitter2 } from '@nestjs/event-emitter';
// import { OrderCreatedEvent } from './events/orderCreated.event';
// import { InventoryService } from '../inventory/inventory.service';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order)
        private readonly dataSource: DataSource,
    ) {}

    async create(userId: string, email: string, createOrderDto: CreateOrderDto) {
        const productIds = createOrderDto.items.map((item) => item.productId);

        // Don't allow the same product twice in one order
        const uniqueProductIds = [...new Set(productIds)].sort();

        if (uniqueProductIds.length !== productIds.length)
            throw new BadRequestException('A product cannot appear multiple times in an order');

        const result = await this.dataSource.query(
            `
            SELECT fn_order_products(
                $1::jsonb,
                $2::integer
            ) AS "orderId"
            `,
            [JSON.stringify(createOrderDto.items), Number(userId)],
        );

        const orderId = result[0].orderId;

        return {
            message: 'Order created successfully.',
            orderId: orderId,
            email: email,
        };
    }
}
