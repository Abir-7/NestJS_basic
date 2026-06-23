import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MailModule } from '../mail/mail.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { UserProfile } from '../user-profile/entities/user-profile.entity';

@Module({
  imports: [MailModule, TypeOrmModule.forFeature([User, UserProfile])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
