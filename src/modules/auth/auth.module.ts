import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { UserProfile } from '../user-profile/entities/user-profile.entity';
import { UserAuthentication } from '../user-authentication/entities/user-authentication.entity';
import { UserProfilePhoto } from '../user-profile/entities/user-profile-photo';

import { JobsModule } from '../jobs/jobs.module';
import { UserDevices } from '../user-device/entities/user-device.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserProfile,
      UserAuthentication,
      UserProfilePhoto,
      UserDevices,
    ]),
    JobsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
