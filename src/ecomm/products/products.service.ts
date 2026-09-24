import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entity/products.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './DTO/createProduct.dto';
import { UpdateProductDto } from './DTO/updateProduct.dto';
import { Category } from '../category/entity/category.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ProductCreatedEvent } from './events/productCreated.events';
import { UploadedCsvFile } from 'src/common/interfaces/uploaded-csv-file.interceptor';
import { Readable } from 'typeorm/platform/PlatformTools.js';
import csvParser from 'csv-parser';
import { elapsedMs, getLogMemory } from 'src/common/utils/performance.util';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
        private readonly eventEmitter: EventEmitter2,
    ) {}

    async create(createProductDto: CreateProductDto) {
        const category = await this.categoryRepository.findOne({
            where: {
                id: createProductDto.categoryId,
            },
        });

        if (!category) throw new NotFoundException('Category not found');

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
            new ProductCreatedEvent(savedProduct.id, createProductDto.stock),
        );

        return {
            message: 'Product created successfully.',
        };
    }

    async findAll(): Promise<Product[]> {
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
            message: 'Product updated successfully.',
        };
    }

    // Delete
    async remove(id: string) {
        const product = await this.findOne(id);

        await this.productRepository.remove(product);
        return {
            message: 'Product deleted successfully',
        };
    }

    async bulkUpload(file: UploadedCsvFile) {
        const startParsing = performance.now();
        getLogMemory('Before CSV parsing');

        if (!file) throw new BadRequestException('CSV file is required');

        const products: Partial<Product>[] = [];

        await new Promise<void>((resolve, reject) => {
            Readable.from(file.buffer)
                .pipe(csvParser())
                .on('data', (row) => {
                    products.push({
                        name: row.name,
                        description: row.description,
                        price: Number(row.price),
                        isActive: row.isActive === 'true',
                        categoryId: row.categoryId,
                    });
                })
                .on('end', () => {
                    resolve();
                })
                .on('error', (error) => {
                    reject(error);
                });
        });

        const endParsing = performance.now();
        getLogMemory('After CSV parsing');

        const startDb = performance.now();

        // bruteforce

        // for (const product of products ) {
        //     await this.productRepository.save(product);
        // }

        // using typeOrm bulk insert

        // await this.productRepository
        //     .createQueryBuilder()
        //     .insert()
        //     .into(Product)
        //     .values(products)
        //     .execute();

        // batch insert

        // const batchSize = 500;
        // for(let i=0; i<products.length; i+=batchSize) {
        //     const batch = products.slice(i, i+batchSize);

        //     const batchStart = performance.now();

        //     await this.productRepository
        //         .createQueryBuilder()
        //         .insert()
        //         .into(Product)g('After
        //         .values(batch)
        //         .execute();

        //     const batchTime = performance.now() - batchStart;

        //     console.log(
        //         `[BATCH] ${i + 1}-${i + batch.length} | ${batchTime.toFixed(2)} ms`,
        //     );
        // }

        const endDb = performance.now();
        getLogMemory('After DB operation');

        const totalTime = endDb - startParsing;

        return {
            message: `Products uploaded successfully and csv parsing took total time: ${(endParsing - startParsing).toFixed(2)} ms`,
            count: products.length,
            DB_duration_Ms: Number((endDb - startDb).toFixed(2)),
            rows_per_second: `${(products.length / (totalTime / 1000)).toFixed(2)} rows/sec`,
        };
    }

    async bulkUploadStreamBatching(file: UploadedCsvFile) {
        if (!file) {
            throw new BadRequestException('CSV file is required');
        }

        const totalStart = performance.now();
        getLogMemory('START');

        const batchSize = 1000;
        let batch: Partial<Product>[] = [];
        let totalInserted = 0;
        let batchNumber = 0;
        let totalDbTime = 0;

        const stream = Readable.from(file.buffer).pipe(csvParser());

        getLogMemory('CSV stream created');

        for await (const row of stream) {
            batch.push({
                name: row.name,
                description: row.description,
                price: Number(row.price),
                isActive: row.isActive === 'true',
                categoryId: row.categoryId,
            });

            if (batch.length === batchSize) {
                batchNumber++;
                const batchStart = performance.now();
                getLogMemory(`Before Batch ${batchNumber}`);

                await this.productRepository
                    .createQueryBuilder()
                    .insert()
                    .into(Product)
                    .values(batch)
                    .execute();

                const batchTime = elapsedMs(batchStart);
                totalDbTime += batchTime;

                totalInserted += batch.length;

                getLogMemory(`After Batch ${batchNumber}`);

                console.log(
                    `[BATCH ${batchNumber}] ` +
                        `${batch.length} rows | ` +
                        `${batchTime.toFixed(2)} ms | ` +
                        `${(batch.length / (batchTime / 1000)).toFixed(2)} rows/sec`,
                );
                batch = [];
            }
        }

        if (batch.length > 0) {
            batchNumber++;
            const batchStart = performance.now();

            await this.productRepository
                .createQueryBuilder()
                .insert()
                .into(Product)
                .values(batch)
                .execute();

            const batchTime = elapsedMs(batchStart);
            totalDbTime += batchTime;

            totalInserted += batch.length;

            console.log(
                `[BATCH ${batchNumber}] ` +
                    `${batch.length} rows | ` +
                    `${batchTime.toFixed(2)} ms`,
            );

            batch = [];
        }

        const totalTime = elapsedMs(totalStart);
        getLogMemory('END');

        return {
            message: 'Products uploaded successfully via streaming and batching',
            total_inserted: totalInserted,
            total_time: totalTime,
            total_db_time: totalDbTime,
        };
    }
}
