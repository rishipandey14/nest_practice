import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from "bcrypt";
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';
import { ForgotPasswordDTO } from './DTO/ForgotPassword.dto';
import { RegisterUserDTO } from 'src/user/DTO/RegisterUser.dto';
import { InjectModel } from '@nestjs/mongoose';
import { PasswordResetToken } from './Schemas/PasswordResetToken.schema';
import { Model } from 'mongoose';
import { createHash, randomBytes } from 'crypto';
import { ResetPasswordDTO } from './DTO/ResetPasswpord.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly mailService: MailService,

        @InjectModel(PasswordResetToken.name)
        private readonly passwordResetTokenModel: Model<PasswordResetToken>
    ) {}

    async RegisterUser(registerUserDto: RegisterUserDTO) {

        const saltRound = 10;
        const hashedPassword = await bcrypt.hash(registerUserDto.password, saltRound);
        // Logic for User Registeration
        /**
         * Check if email already exist
         * hash the password
         * store the user in DataBase
         * generate JWT Token
         * return token in response
         */
        const user = await this.userService.createUser(registerUserDto, hashedPassword);

        await this.mailService.sendWelcomeEmail(
            user.email,
            user.name
        )

        const payload = {
            sub: user._id,
            email: user.email,
            role: user.role
        }
        const token = await this.jwtService.signAsync(payload);

        return {
            message: 'User registered successfully',
            access_token: token,
        };
    }

    async ForgotPassword(forgotPasswordDto: ForgotPasswordDTO) {
        /**
         * find user
         * generate reset token
         * hash token + save to db
         * push email job in queue
         * email worker picks up
         * send reset link
         */

        const {email} = forgotPasswordDto;

        const user = await this.userService.findByEmail(email);

        if(!user) return {
            message: "if an account exists with this email, a reset link has been sent."
        }

        const raw_token = randomBytes(32).toString('hex');
        const token_hash = createHash('sha256')
            .update(raw_token)
            .digest('hex')
        
        const expires_at = new Date(Date.now() + 15 * 60 * 1000 );  // 15 min

        // delete previous unused token
        await this.passwordResetTokenModel.deleteMany({
            user_id: user._id,
            used_at: null
        });

        await this.passwordResetTokenModel.create({
            user_id: user._id,
            token_hash: token_hash,
            expires_at: expires_at
        });

        await this.mailService.sendResetPasswordMail(email, raw_token);
        
        return {
            message: "if an account exists with this email, a reset link has been sent."
        }
    }

    async ResetPassword(resetPasswordDto: ResetPasswordDTO) {
        const {token} = resetPasswordDto;

        // 1-> Hash the token received
        const token_hash = createHash('sha256').update(token).digest('hex');

        // console.log('token hash ->' , token_hash);

        // 2 -> Find the token in DB
        const reset_token = await this.passwordResetTokenModel.findOne({
            token_hash
        });

        // console.log('reset token ->' , reset_token);

        // 3-> Token doesn't exist
        if(!reset_token) throw new BadRequestException('Invalid or Expired reset token.');
        
        // 4-> Token has already been used 
        if(reset_token.used_at) throw new BadRequestException('Reset token has already been used.');

        // 5 -> token has been expired
        if(reset_token.expires_at < new Date()) throw new BadRequestException('Reset token has been expired.');

        const user = await this.userService.findById(reset_token.user_id);

        if(!user) throw new BadRequestException('user not found.');

        const hashed_password = await bcrypt.hash(resetPasswordDto.new_password, 10);

        await this.userService.updatePassword(user._id, hashed_password);

        await this.passwordResetTokenModel.findByIdAndUpdate(
            reset_token._id,
            {used_at: new Date()},
        );

        await this.mailService.sendPasswordChangeConfirmationMail(user.email);

        return {
            message: "Password reset successfully"
        }

    }
}
