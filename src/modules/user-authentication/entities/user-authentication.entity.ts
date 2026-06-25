import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';

export enum AuthenticationType {
  EMAIL_VERIFICATION = 'email_verification',
  PASSWORD_RESET = 'password_reset',
}

export enum AuthenticationStatus {
  UNUSED = 'unused',
  USED = 'used',
  EXPIRED = 'expired',
}

@Entity('user_authentication')
export class UserAuthentication extends BaseEntity {
  @Column()
  type!: AuthenticationType;
  @Column({ nullable: true })
  code?: string;
  @Column({ nullable: true })
  token?: string;
  @Column({ default: AuthenticationStatus.UNUSED })
  status?: AuthenticationStatus;
  @ManyToOne(() => User, (user) => user.userAuthentication, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user!: User;
}
