import { Module } from '@nestjs/common';
import { UserAuthenticationService } from './user-authentication.service';
import { UserAuthenticationController } from './user-authentication.controller';

@Module({
  controllers: [UserAuthenticationController],
  providers: [UserAuthenticationService],
})
export class UserAuthenticationModule {}
