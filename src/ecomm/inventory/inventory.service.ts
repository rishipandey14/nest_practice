import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Inventory } from './entity/inventory.entity';
import { Repository } from 'typeorm';
import { Product } from '../products/entity/products.entity';
import { UpdateInventoryDto } from './DTO/updateInventory.dto';
import { OnEvent } from '@nestjs/event-emitter';
import { ProductCreatedEvent } from '../products/events/productCreated.events';

@Injectable()
export class InventoryService {
    constructor(
        @InjectRepository(Inventory) private readonly inventoryRepository : Repository<Inventory>,
        @InjectRepository(Product) private readonly productRepository : Repository<Product>,
    ) {}

    @OnEvent('product.created')
    async handleProductCreated (event: ProductCreatedEvent) {
        await this.createForProduct(event.productId, event.stockNumber);
    }

    async createForProduct (productId: string, initialStock: number) : Promise<Inventory> {
        const product = await this.productRepository.findOne({
            where: {id: productId}
        });

        if(!product) throw new NotFoundException('Product not found.');

        const existingInventory = await this.inventoryRepository.findOne({
            where: {productId}
        });

        if(existingInventory) return existingInventory;

        const inventory = await this.inventoryRepository.create({
            productId,
            quantity: initialStock,
            reservedQuantity: 0
        });
        return this.inventoryRepository.save(inventory);
    };

    async findByProductId(productId: string): Promise<Inventory> {
        const inventory = await this.inventoryRepository.findOne({
            where: { productId }
        });

        if (!inventory) throw new NotFoundException('Inventory not found for this product');

        return inventory;
    }

    async updateQuantity(productId: string, dto: UpdateInventoryDto): Promise<Inventory> {
        const inventory = await this.findByProductId(productId);

        inventory.quantity = dto.quantity;

        return this.inventoryRepository.save(inventory);
    }
}
