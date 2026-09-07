import { BadRequestException, ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Roles, RolesDocument } from './schemas/roles.schema';
import { Permission, PermissionDocument } from 'src/permission/schemas/permission.schema';
import { CreateRoleDTO } from './DTO/createRole.dto';
import { UpdateRoleDTO } from './DTO/updateRole.dto';

@Injectable()
export class RolesService {
    constructor( 
        @InjectModel(Roles.name) private readonly roleModel: Model<RolesDocument>,
        @InjectModel(Permission.name) private readonly permissionModel: Model<PermissionDocument>,
    ) {}

    async createRole(dto: CreateRoleDTO) {
        // Check duplicate role name
        const existingRole = await this.roleModel.findOne({
            name: dto.name.toLowerCase()
        });

        if (existingRole) {
            throw new ConflictException('Role already exists');
        }

        // Validate permissions
        await this.validatePermissions(dto.permission_ids);

        // Generate numeric role ID
        const lastRole = await this.roleModel.findOne().sort({ id: -1 }).lean();
        const nextId = lastRole ? lastRole.id + 1 : 1;

        return this.roleModel.create({
            id: nextId,
            name: dto.name.toLowerCase(),
            description: dto.description ?? '',
            permission_ids: dto.permission_ids
        });
    }

    async getRoles() {
        return this.roleModel.find().sort({ id: 1 }).lean();
    }

    async getRoleById(id: number) {
        const role = await this.roleModel.findOne({ id }).lean();

        if (!role) {
            throw new NotFoundException('Role not found');
        }
        return role;
    }

    async updateRole(id: number, dto: UpdateRoleDTO) {
        const role = await this.roleModel.findOne({ id });

        if (!role) {
            throw new NotFoundException('Role not found');
        }

        if (role.isSystemRole) {
            throw new BadRequestException('System roles cannot be modified');
        }

        if (dto.permission_ids) {
            await this.validatePermissions(dto.permission_ids);

            role.permission_ids = dto.permission_ids;
        }

        if (dto.name) {
            role.name = dto.name.toLowerCase();
        }

        if (dto.description !== undefined) {
            role.description = dto.description;
        }

        await role.save();
        return role;
    }

    async deleteRole(id: number) {
        const role = await this.roleModel.findOne({ id });

        if (!role) {
            throw new NotFoundException('Role not found');
        }

        if (role.isSystemRole) {
            throw new BadRequestException('System roles cannot be deleted');
        }

        await this.roleModel.deleteOne({ id });

        return {
            message: 'Role deleted successfully',
        };
    }

    private async validatePermissions(permissionIds: number[]) {
        const uniqueIds = [...new Set(permissionIds)];

        const count = await this.permissionModel.countDocuments({
            id: {
                $in: uniqueIds,
            },
        });

        if (count !== uniqueIds.length) {
            throw new BadRequestException('One or more permission IDs are invalid');
        }
    }
}
