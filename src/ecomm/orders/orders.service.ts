import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';
import { Repository } from 'typeorm';
import { OrderItem } from './entity/orderItem.entity';
import { Product } from '../products/entity/products.entity';
import { CreateOrderDto } from './DTO/createOrder.dto';
import { OrderStatus } from './enums/orderStatus.enum';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OrderCreatedEvent } from './events/orderCreated.event';
import { InventoryService } from '../inventory/inventory.service';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order) private readonly orderRepository : Repository<Order>,
        @InjectRepository(OrderItem) private readonly orderItemRepository : Repository<OrderItem>,
        @InjectRepository(Product) private readonly productRepository : Repository<Product>,
        private readonly eventEmitter: EventEmitter2,
        private readonly inventoryService: InventoryService
    ) {}

    async create( userId: string, email: string, createOrderDto: CreateOrderDto) {
        const productIds = createOrderDto.items.map(
            (item) => item.productId,
        );

        // Don't allow the same product twice in one order
        const uniqueProductIds = [
            ...new Set(productIds),
        ].sort();

        if (uniqueProductIds.length !== productIds.length) throw new BadRequestException('A product cannot appear multiple times in an order');

        const result = await this.orderRepository.manager.transaction(
            async (manager) => {
                // 1. Get products

                const products = await manager
                    .getRepository(Product)
                    .createQueryBuilder('product')
                    .where('product.id IN (:...productIds)', { productIds: uniqueProductIds })
                    .andWhere('product.isActive = :isActive', { isActive: true })
                    .getMany();

                if (products.length !== uniqueProductIds.length) {
                    throw new NotFoundException(
                        'One or more products were not found',
                    );
                }

                // 2. Check + reserve inventory

                let total = 0;

                const orderItems: Partial<OrderItem>[] = [];

                for (const item of createOrderDto.items) {
                    const product = products.find((p) => p.id === item.productId);

                    if (!product) throw new NotFoundException(`Product ${item.productId} not found`);

                    const price = Number(product.price);

                    total += price * item.quantity;

                    await this.inventoryService.reserveStock(manager, product.id, item.quantity);

                    orderItems.push({
                        productId: product.id,
                        quantity: item.quantity,
                        price,
                    });
                }

                // 3. Create order

                const order = manager.getRepository(Order).create({
                    userId,
                    status: OrderStatus.PENDING,
                    total,
                    items: orderItems as OrderItem[],
                });

                const savedOrder = await manager
                    .getRepository(Order)
                    .save(order);

                return {
                    savedOrder,
                    orderItems,
                };
            },
        );

        // 4. Only AFTER COMMIT emit event

        this.eventEmitter.emit(
            'order.created',
            new OrderCreatedEvent(
                result.savedOrder.id,
                email,
                result.orderItems.map((item) => ({
                    productId: item.productId!,
                    quantity: item.quantity!,
                })),
            ),
        );

        return {
            message: 'Order created successfully.',
            data: result.savedOrder,
        };
    }

}
