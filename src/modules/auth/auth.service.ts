import { ConflictException, Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { UserProfile } from '../user-profile/entities/user-profile.entity';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { EmailProducer } from '../jobs/producers/email.producer';
import { generateCode } from '../../common/utils/generate-code.util';
import { UserAuthentication } from '../user-authentication/entities/user-authentication.entity';
@Injectable()
export class AuthService {
  constructor(
    private readonly emailProducer: EmailProducer,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserProfile)
    private readonly profileRepository: Repository<UserProfile>,
    @InjectRepository(UserAuthentication)
    private readonly authenticationRepository: Repository<UserAuthentication>,
  ) {}
  async register(dto: RegisterDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const profile = this.profileRepository.create({
      fullName: dto.fullName,
    });
    const otp = generateCode(6, 'digit');
    const authentication_data = this.authenticationRepository.create({
      code: otp,
      type: 'email',
    });
    const user = this.userRepository.create({
      email: dto.email,
      password: hashedPassword,
      profile,
      userAuthentication: authentication_data,
    });

    const savedUser = await this.userRepository.save(user);

    await this.emailProducer.sendVerificationEmail(savedUser.email, otp);
    return {
      message: 'Registration successful',
      user_id: savedUser.id,
    };
  }
}
