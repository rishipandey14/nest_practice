import { CacheInterceptor } from '@nestjs/cache-manager';
import { ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class UserCacheInterceptor extends CacheInterceptor {
    trackBy(context: ExecutionContext): string | undefined {
        const request = context.switchToHttp().getRequest();
        const limit = request.query.limit ?? '10';
        const offset = request.query.offset ?? '0';

        return `users:${limit}:${offset}`;
    }
}
