import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { UpdateInventoryDto } from './DTO/updateInventory.dto';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get(':productId')
  findByProductId(@Param('productId') productId: string) {
      return this.inventoryService.findByProductId(productId);
  }

  @Patch(':productId')
  updateQuantity(@Param('productId') productId: string, @Body() dto: UpdateInventoryDto) {
     return this.inventoryService.updateQuantity(productId, dto);
  }
}
