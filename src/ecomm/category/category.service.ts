import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entity/category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './DTO/createCategory.dto';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) {}

    async create(createCategoryDto: CreateCategoryDto) {
        const existingCategory = await this.categoryRepository.findOne({
            where: {
                name: createCategoryDto.name,
            },
        });

        if (existingCategory) throw new ConflictException('Category with this name already exists');

        const category = this.categoryRepository.create(createCategoryDto);

        this.categoryRepository.save(category);

        return {
            message: `Category: ${createCategoryDto.name} created successfully.`,
        };
    }

    async findAll(): Promise<Category[]> {
        return this.categoryRepository.find({
            order: {
                created_at: 'DESC',
            },
        });
    }

    async findOne(id: string): Promise<Category> {
        const category = await this.categoryRepository.findOne({
            where: { id },
        });

        if (!category) throw new NotFoundException('Category not found');

        return category;
    }
}
