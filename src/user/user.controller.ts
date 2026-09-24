import {
    Controller,
    DefaultValuePipe,
    Get,
    ParseIntPipe,
    Query,
    UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { SkipThrottle } from '@nestjs/throttler';
import { UserCacheInterceptor } from 'src/shared/interceptor/user-cache.interceptor';
// import { Permissions } from 'src/permission/decorator/permission.decorator';
// import { SkipAuth } from 'src/auth/Decorators/skipAuth.decorator';

@Controller()
export class UserController {
    constructor(private readonly userService: UserService) {}

    @SkipThrottle({ short: true, medium: true })
    @UseInterceptors(UserCacheInterceptor)
    // @Permissions('user:view')
    // @CacheTTL(30 * 1000)
    @Get('/users')
    async getUsers(
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
        @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    ) {
        return this.userService.getAllUser(limit, offset);
    }
}
