import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { SKIP_AUTH_KEY } from "../Decorators/skipAuth.decorator";


@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly reflector: Reflector
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // check skipAuth()
        const skipAuth = this.reflector.getAllAndOverride<boolean> (
            SKIP_AUTH_KEY,
            [context.getHandler(), context.getClass()]
        )

        if(skipAuth) return true;

        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromRequest(request);
        
        if(!token) throw new UnauthorizedException();

        try{
            const payload = await this.jwtService.verifyAsync(token);
            console.log(payload);
            request['user'] = payload;
        } catch {
            throw new UnauthorizedException();
        }
        return true;
    }

    private extractTokenFromRequest(request: Request) : string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token: undefined;
    }
}