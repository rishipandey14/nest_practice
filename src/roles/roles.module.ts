import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Roles, RolesSchema } from './schemas/roles.schema';
import { Permission, PermissionSchema } from 'src/permission/schemas/permission.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Roles.name,
        schema: RolesSchema,
      },
      {
        name: Permission.name,
        schema: PermissionSchema,
      }
    ])
  ],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService]
})
export class RolesModule {}
