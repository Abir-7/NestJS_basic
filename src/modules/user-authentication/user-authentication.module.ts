import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAuthenticationService } from './user-authentication.service';
import { UserAuthenticationController } from './user-authentication.controller';
import { UserAuthentication } from './entities/user-authentication.entity';
import { User } from '../users/entities/user.entity';
import { JobsModule } from '../jobs/jobs.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserAuthentication, User]), JobsModule],
  controllers: [UserAuthenticationController],
  providers: [UserAuthenticationService],
})
export class UserAuthenticationModule {}
