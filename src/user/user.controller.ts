import { Controller, Get, UseGuards, UseInterceptors } from "@nestjs/common";
import { UserService } from "./user.service";
import { SkipThrottle } from "@nestjs/throttler";
import { CacheInterceptor, CacheKey, CacheTTL } from "@nestjs/cache-manager";


@Controller()
export class UserController {
    constructor(private readonly userService: UserService) {}

    @SkipThrottle({'short': true, 'medium': true})
    @UseInterceptors(CacheInterceptor)
    @CacheKey('users')
    // @CacheTTL(30 * 1000)
    @UseGuards()
    @Get('/users')
    async getUsers() {
        return this.userService.getAllUser();
    }
}