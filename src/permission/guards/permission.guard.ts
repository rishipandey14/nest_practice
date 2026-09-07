import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Roles, RolesDocument } from "src/roles/schemas/roles.schema";
import { Permission, PermissionDocument } from "../schemas/permission.schema";
import { PERMISSION_KEY } from "../decorator/permission.decorator";


@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        @InjectModel(Roles.name) private readonly rolesModel: Model<RolesDocument>,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
            PERMISSION_KEY,
            [context.getHandler(), context.getClass()]
        )
        // No @Permission() decorator
        if(!requiredPermissions) return true;

        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if(!user) throw new ForbiddenException("User not authenticate.");
        
        if(!user.role_id) throw new ForbiddenException("User does not have any role.");

        // find user's role
        const role = await this.rolesModel.aggregate([
            {
                $match: {
                id: user.role_id,
                },
            },
            {
                $lookup: {
                from: 'permissions',
                localField: 'permission_ids',
                foreignField: 'id',
                as: 'permissions',
                },
            },
            {
                $project: {
                _id: 0,
                id: 1,
                name: 1,
                permissions: '$permissions.key',
                },
            },
        ]);


        if(!role.length) throw new ForbiddenException("Invalid role");

        // get permissions belonging to the role
        const permissions : string[] = role[0].permissions;

        // check required permissions
        const hasPermission = requiredPermissions.every(
            permission => permissions.includes(permission)
        );

        if(!hasPermission) throw new ForbiddenException("You do not have parmission to perform this action.");

        return true;
    }
}