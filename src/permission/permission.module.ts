import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Permission, PermissionSchema } from './schemas/permission.schema';
import { APP_GUARD } from '@nestjs/core';
import { PermissionGuard } from './guards/permission.guard';
import { Roles, RolesSchema } from 'src/roles/schemas/roles.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Permission.name,
        schema: PermissionSchema,
      },
      {
        name: Roles.name,
        schema: RolesSchema
      }
    ]),
  ],
  controllers: [PermissionController],
  providers: [
    PermissionService,
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    }
  ],
  exports: [PermissionService]
})
export class PermissionModule {}
