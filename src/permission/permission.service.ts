import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Permission, PermissionDocument } from './schemas/permission.schema';
import { Model } from 'mongoose';
import { PermissionsSeed } from './permission.seed';

@Injectable()
export class PermissionService {
    constructor(
        @InjectModel(Permission.name)
        private readonly permissionModel: Model<PermissionDocument>,
    ) {}

    async SeedPermissions() {
        for (const permission of PermissionsSeed) {
            await this.permissionModel.updateOne(
                {
                    id: permission.id,
                },
                {
                    $set: {
                        key: permission.key,
                        Description: permission.description,
                    },
                },
                {
                    upsert: true,
                },
            );
        }
        console.log('Permission seeded successfully');
    }
}
