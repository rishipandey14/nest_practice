import {
    Body,
    Controller,
    Delete,
    Param,
    Patch,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './DTO/createProduct.dto';
import { UpdateProductDto } from './DTO/updateProduct.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import type { UploadedCsvFile } from 'src/common/interfaces/uploaded-csv-file.interceptor';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @Post()
    async create(@Body() createProductDto: CreateProductDto) {
        return this.productsService.create(createProductDto);
    }

    @Post('bulk-upload')
    @UseInterceptors(FileInterceptor('file'))
    async bulkUpload(@UploadedFile() file: UploadedCsvFile) {
        return this.productsService.bulkUpload(file);
    }

    @Post('bulk-upload-stream-batching')
    @UseInterceptors(FileInterceptor('file'))
    async bulkUploadStream(@UploadedFile() file: UploadedCsvFile) {
        return this.productsService.bulkUploadStreamBatching(file);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
        return this.productsService.update(id, updateProductDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.productsService.remove(id);
    }
}
