import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { SkipThrottle } from '@nestjs/throttler';
import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';
import { Permissions } from 'src/permission/decorator/permission.decorator';
// import { SkipAuth } from 'src/auth/Decorators/skipAuth.decorator';

@Controller()
export class UserController {
    constructor(private readonly userService: UserService) {}

    @SkipThrottle({ short: true, medium: true })
    @UseInterceptors(CacheInterceptor)
    @CacheKey('users')
    // @Permissions('user:view')
    // @CacheTTL(30 * 1000)
    @Get('/users')
    async getUsers() {
        return this.userService.getAllUser();
    }
}
