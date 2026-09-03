import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../Decorators/roles.decorator";


@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean>  {
        const requiredRoles = await this.reflector.getAllAndOverride<string[]> (
            ROLES_KEY,
            [context.getHandler(), context.getClass()]
        )

        // No @Roles() decorator = allow
        if(!requiredRoles) return true;
        // console.log(requiredRoles);

        const request = context.switchToHttp().getRequest();
        const user = request['user'];
        // console.log(user)

        if(!user) throw new ForbiddenException('User not Authenticated');

        if(!requiredRoles.includes(user.role)) {
            throw new ForbiddenException('You do not have parmission to access this resource.')
        }
        return true;
    }
};