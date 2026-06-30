import * as crypto from 'crypto';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  AuthenticationStatus,
  AuthenticationType,
  UserAuthentication,
} from './entities/user-authentication.entity';
import { User } from '../users/entities/user.entity';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { generateCode } from '../../common/utils/generate-code.util';
import { EmailProducer } from '../jobs/producers/email.producer';
import { SmsProducer } from '../jobs/producers/sms.producer';

@Injectable()
export class UserAuthenticationService {
  constructor(
    @InjectRepository(UserAuthentication)
    private readonly authRepository: Repository<UserAuthentication>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly emailProducer: EmailProducer,
    private readonly smsProducer: SmsProducer,
  ) {}

  async verifyOtp(dto: VerifyOtpDto) {
    const { user_id, code } = dto;

    const user = await this.userRepository.findOne({
      where: { id: user_id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isVerified) {
      throw new ConflictException('User is already verified');
    }

    const authType = user.email
      ? AuthenticationType.EMAIL_VERIFICATION
      : AuthenticationType.PHONE_VERIFICATION;

    const authRecord = await this.authRepository.findOne({
      where: {
        user: { id: user.id },
        code,
        type: authType,
        status: AuthenticationStatus.UNUSED,
      },
    });

    if (!authRecord) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    authRecord.status = AuthenticationStatus.USED;
    user.isVerified = true;

    await this.authRepository.save(authRecord);
    await this.userRepository.save(user);

    return { message: 'Verification successful' };
  }

  async verifyPasswordResetOtp(dto: VerifyOtpDto) {
    const { user_id, code } = dto;

    const user = await this.userRepository.findOne({
      where: { id: user_id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const authRecord = await this.authRepository.findOne({
      where: {
        user: { id: user.id },
        code,
        type: AuthenticationType.PASSWORD_RESET,
        status: AuthenticationStatus.UNUSED,
      },
    });

    if (!authRecord) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    // Generate a reset token and store it on the auth record
    const resetToken = crypto.randomUUID();
    authRecord.status = AuthenticationStatus.USED;
    authRecord.token = resetToken;
    await this.authRepository.save(authRecord);

    return {
      message: 'Password reset OTP verified successfully',
      token: resetToken,
    };
  }

  async resendOtp(dto: ResendOtpDto) {
    const { user_id } = dto;

    const user = await this.userRepository.findOne({
      where: { id: user_id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Look up the most recent UNUSED auth record to determine the type
    const existingAuth = await this.authRepository.findOne({
      where: {
        user: { id: user.id },
        status: AuthenticationStatus.UNUSED,
      },
      order: { createdAt: 'DESC' },
    });

    // Fall back to inferring type from the user's contact info
    const type =
      existingAuth?.type ??
      (user.email
        ? AuthenticationType.EMAIL_VERIFICATION
        : user.phone
          ? AuthenticationType.PHONE_VERIFICATION
          : undefined);

    if (!type) {
      throw new BadRequestException(
        'No OTP to resend. Please initiate the request first.',
      );
    }

    // Validate that the user has the required contact for the determined type
    if (type === AuthenticationType.EMAIL_VERIFICATION && !user.email) {
      throw new BadRequestException('User does not have an email address');
    }
    if (type === AuthenticationType.PHONE_VERIFICATION && !user.phone) {
      throw new BadRequestException('User does not have a phone number');
    }
    if (type === AuthenticationType.PASSWORD_RESET) {
      if (!user.email && !user.phone) {
        throw new BadRequestException(
          'User has no contact method for password reset',
        );
      }
    }

    // Expire any existing unused OTPs for this user and type
    await this.authRepository.update(
      {
        user: { id: user.id },
        type,
        status: AuthenticationStatus.UNUSED,
      },
      { status: AuthenticationStatus.EXPIRED },
    );

    // Generate and save a new OTP
    const otp = generateCode(6, 'digit');
    const newAuthRecord = this.authRepository.create({
      code: otp,
      type,
      status: AuthenticationStatus.UNUSED,
      user,
    });
    await this.authRepository.save(newAuthRecord);

    // Send the OTP via the appropriate channel
    if (type === AuthenticationType.EMAIL_VERIFICATION && user.email) {
      await this.emailProducer.sendVerificationEmail(user.email, otp);
    }
    if (type === AuthenticationType.PHONE_VERIFICATION && user.phone) {
      await this.smsProducer.sendOtp(user.phone, otp);
    }
    if (type === AuthenticationType.PASSWORD_RESET) {
      if (user.email) {
        await this.emailProducer.sendPasswordResetEmail(user.email, otp);
      } else if (user.phone) {
        await this.smsProducer.sendOtp(user.phone, otp);
      }
    }

    return { message: 'OTP resent successfully' };
  }
}
