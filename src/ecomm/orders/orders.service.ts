import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';
import { Repository } from 'typeorm';
import { OrderItem } from './entity/orderItem.entity';
import { Product } from '../products/entity/products.entity';
import { CreateOrderDto } from './DTO/createOrder.dto';
import { OrderStatus } from './enums/orderStatus.enum';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OrderCreatedEvent } from './events/orderCreated.event';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order) private readonly orderRepository : Repository<Order>,
        @InjectRepository(OrderItem) private readonly orderItemRepository : Repository<OrderItem>,
        @InjectRepository(Product) private readonly productRepository : Repository<Product>,
        private readonly eventEmitter: EventEmitter2
    ) {}

    async create (userId: string, createOrderDto: CreateOrderDto) {
        // get all the productIds from order items
        const productIds = createOrderDto.items.map((item) => item.productId)

        // find those products in the DB
        const products = await this.productRepository.find({
            where: productIds.map((id) =>({
                id, 
                isActive: true
            }))
        });

        // make sure every requested product exists
        if(products.length !== productIds.length) throw new NotFoundException("One or more products were not found");


        // calculate the total order amount
        let total = 0;

        const orderItems = createOrderDto.items.map((item) => {
            const product = products.find(
                (p) => p.id === item.productId,
            );

            if(!product) throw new NotFoundException(`Product ${item.productId} not found`);

            const price = Number(product.price);
            total += (price * item.quantity)

            return {
                productId: product.id,
                quantity: item.quantity,
                price
            };
        });

        const order = this.orderRepository.create({
            userId,
            status: OrderStatus.PENDING,
            total,
            items: orderItems as OrderItem[]
        });

        const savedOrder = await this.orderRepository.save(order);

        this.eventEmitter.emit(
            'order.created',
            new OrderCreatedEvent(
                savedOrder.id,
                orderItems.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity
                })),
            )
        );

        return {
            message: "Order created successfully.",
            data: order
        }
    }
}
