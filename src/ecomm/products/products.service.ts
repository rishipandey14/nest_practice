import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entity/products.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './DTO/createProduct.dto';
import { UpdateProductDto } from './DTO/updateProduct.dto';
import { Category } from '../category/entity/category.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ProductCreatedEvent } from './events/productCreated.events';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product) private readonly productRepository : Repository<Product> ,
        @InjectRepository(Category) private readonly categoryRepository : Repository<Category> ,
        private readonly eventEmitter: EventEmitter2,
    ) {}

    async create(createProductDto: CreateProductDto) {
        const category = await this.categoryRepository.findOne({
            where: {
            id: createProductDto.categoryId,
            },
        });

        if(!category) throw new NotFoundException('Category not found');

        const product = this.productRepository.create({
            name: createProductDto.name,
            description: createProductDto.description,
            price: createProductDto.price,
            isActive: createProductDto.isActive ?? true,
            category,
        });

        const savedProduct = await this.productRepository.save(product);

        this.eventEmitter.emit(
            'product.created',
            new ProductCreatedEvent(savedProduct.id, createProductDto.stock)
        )

        return {
            message: "Product created successfully."
        };
    }

    async findAll() : Promise<Product[]> {
        return this.productRepository.find();
    }

    // Get one
    async findOne(id: string): Promise<Product> {
        const product = await this.productRepository.findOne({
            where: { id },
        });

        if (!product) {
        throw new NotFoundException(`Product with ID ${id} not found`);
        }

        return product;
    }

    async update(id: string, updateProductDto: UpdateProductDto) {
        const product = await this.findOne(id);

        Object.assign(product, updateProductDto);

        this.productRepository.save(product);

        return {
            message: "Product updated successfully."
        }
    }

    // Delete
    async remove(id: string) {
        const product = await this.findOne(id);

        await this.productRepository.remove(product);
        return {
            message: "Product deleted successfully"
        };
    }
}
