import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { UserProfile } from '../user-profile/entities/user-profile.entity';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { EmailProducer } from '../jobs/producers/email.producer';
import { generateCode } from '../../common/utils/generate-code.util';
import {
  AuthenticationType,
  UserAuthentication,
} from '../user-authentication/entities/user-authentication.entity';
import { DeleteUserDto } from './dto/deleteUser.dto';
import { UserProfilePhoto } from '../user-profile/entities/user-profile-photo';
import { UserDevices } from '../user-device/entities/user-device.entity';
@Injectable()
export class AuthService {
  constructor(
    private readonly emailProducer: EmailProducer,
    @InjectRepository(UserDevices)
    private readonly userDeviceRepository: Repository<UserDevices>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserProfile)
    private readonly profileRepository: Repository<UserProfile>,
    @InjectRepository(UserAuthentication)
    private readonly authenticationRepository: Repository<UserAuthentication>,
    @InjectRepository(UserProfilePhoto)
    private readonly userProfilePhotoRepository: Repository<UserProfilePhoto>,
  ) {}
  async register(dto: RegisterDto) {
    const existingUser = await this.userRepository.findOne({
      where: dto.email ? { email: dto.email } : { phone: dto.phone },
    });

    if (existingUser && existingUser.isVerified) {
      throw new ConflictException(
        dto.email ? 'Email already exists' : 'Phone already exist',
      );
    }

    if (existingUser && existingUser.id) {
      await this.deleteUser({ user_id: existingUser.id });
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const otp = generateCode(6, 'digit');
    const photo = this.userProfilePhotoRepository.create({});
    const profile = this.profileRepository.create({
      fullName: dto.full_name,
      photo,
    });
    const userAuthentication = this.authenticationRepository.create({
      code: otp,
      type: AuthenticationType.EMAIL_VERIFICATION,
    });

    const userDevice = this.userDeviceRepository.create({
      deviceModel: dto.device_model,
      deviceFingerprint: dto.device_fingerprint,
      ipAddress: dto.ip_Address,
      isEmulator: dto.is_emulator,
      isLoggedIn: false,
      osType: dto.os_type,
    });

    const user = this.userRepository.create({
      email: dto.email,
      phone: dto.phone,
      password: hashedPassword,
      profile,
      userAuthentication,
      userDevices: [userDevice],
    });

    const savedUser = await this.userRepository.save(user);

    if (savedUser.email) {
      await this.emailProducer.sendVerificationEmail(savedUser.email, otp);
    }
    if (savedUser.phone) {
      console.log('phone otp service');
    }
    return {
      message: 'Registration successful',
      userId: savedUser.id,
    };
  }
  async deleteUser(dto: DeleteUserDto) {
    const result = await this.userRepository.delete(dto.user_id);
    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
    return { message: 'User deleted successfully' };
  }
}
