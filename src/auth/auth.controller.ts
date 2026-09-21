import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ForgotPasswordDTO } from './DTO/ForgotPassword.dto';
import { RegisterUserDTO } from 'src/auth/DTO/RegisterUser.dto';
import { ResetPasswordDTO } from './DTO/ResetPasswpord.dto';
import { SkipAuth } from './Decorators/skipAuth.decorator';
import { LoginUserDTO } from './DTO/LoginUser.dto';

@Controller('auth')  // /auth/register
export class AuthController {

    constructor(private readonly authService: AuthService) {
        this.authService = authService;
    }

    // @SkipAuth()
    // @Post('register') 
    // Register(@Body() registerUserDto: RegisterUserDTO) {
    //     return this.authService.RegisterUser(registerUserDto);
    // }

    // @SkipAuth()
    // @Post('register/seller') 
    // RegisterSeller(@Body() registerUserDto: RegisterUserDTO) {
    //     return this.authService.RegisterSeller(registerUserDto);
    // }

    @SkipAuth()
    @Post('login')
    Login(@Body() loginUserDto: LoginUserDTO) {
        return this.authService.LoginUser(loginUserDto);
    }

    // @Post('forgot-password')
    // ForgotPassword(@Body() forgotPasswordDto: ForgotPasswordDTO) {
    //     return this.authService.ForgotPassword(forgotPasswordDto);
    // }

    // @SkipAuth()
    // @Post('reset-password')
    // ResetPassword(@Body() resetPasswordDto: ResetPasswordDTO) {
    //     return this.authService.ResetPassword(resetPasswordDto);
    // }
}