import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ForgotPasswordDTO } from './DTO/ForgotPassword.dto';
import { RegisterUserDTO } from 'src/user/DTO/RegisterUser.dto';
import { ResetPasswordDTO } from './DTO/ResetPasswpord.dto';
import { SkipAuth } from './Decorators/skipAuth.decorator';

@Controller('auth')  // /auth/register
export class AuthController {

    constructor(private readonly authService: AuthService) {
        this.authService = authService;
    }

    @SkipAuth()
    @Post('register') 
    Register(@Body() registerUserDto: RegisterUserDTO) {
        return this.authService.RegisterUser(registerUserDto);
    }

    @Post('forgot-password')
    ForgotPassword(@Body() forgotPasswordDto: ForgotPasswordDTO) {
        return this.authService.ForgotPassword(forgotPasswordDto);
    }

    @SkipAuth()
    @Post('reset-password')
    ResetPassword(@Body() resetPasswordDto: ResetPasswordDTO) {
        return this.authService.ResetPassword(resetPasswordDto);
    }
}