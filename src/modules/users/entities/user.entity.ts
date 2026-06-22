import { Column, Entity, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { UserProfile } from '../../user-profile/entities/user-profile.entity';
import { UserAuthentication } from '../../user-authentication/entities/user-authentication.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column()
  email!: string;
  @Column()
  password!: string;
  @OneToOne(() => UserProfile, (profile) => profile.user)
  profile!: UserProfile;
  @OneToOne(() => UserAuthentication, (authentication) => authentication.user)
  userAuthentication!: UserAuthentication;
}
