import { Body, Controller, Post } from '@nestjs/common';
import { UserAuthenticationService } from './user-authentication.service';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';

@Controller('user-authentication')
export class UserAuthenticationController {
  constructor(
    private readonly userAuthenticationService: UserAuthenticationService,
  ) {}

  @Post('verify-otp')
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.userAuthenticationService.verifyOtp(dto);
  }

  @Post('verify-password-reset-otp')
  verifyPasswordResetOtp(@Body() dto: VerifyOtpDto) {
    return this.userAuthenticationService.verifyPasswordResetOtp(dto);
  }

  @Post('resend-otp')
  resendOtp(@Body() dto: ResendOtpDto) {
    return this.userAuthenticationService.resendOtp(dto);
  }
}
