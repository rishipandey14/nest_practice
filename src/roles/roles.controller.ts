import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDTO } from './DTO/createRole.dto';
import { UpdateRoleDTO } from './DTO/updateRole.dto';
import { SkipAuth } from 'src/auth/Decorators/skipAuth.decorator';

@Controller('roles')
@SkipAuth()
export class RolesController {
    constructor( private readonly roleService: RolesService ) {}

    @Post()
    async createRole(@Body() dto: CreateRoleDTO) {
        return this.roleService.createRole(dto);
    }

    @Get()
    async getRoles() {
        return this.roleService.getRoles();
    }

    @Get(':id')
    async getRoleById( @Param('id', ParseIntPipe) id: number ) {
        return this.roleService.getRoleById(id);
    }

    @Patch(':id')
    async updateRole(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRoleDTO ) {
        return this.roleService.updateRole(
            id,
            dto,
        );
    }

    @Delete(':id')
    async deleteRole(@Param('id', ParseIntPipe) id: number ) {
        return this.roleService.deleteRole(id);
    }
}
