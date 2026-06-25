import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { UserProfile } from '../../user-profile/entities/user-profile.entity';
import { UserAuthentication } from '../../user-authentication/entities/user-authentication.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ default: false })
  isVerified!: boolean;
  @Column({ unique: true, nullable: true })
  email?: string;
  @Column({ unique: true, nullable: true })
  phone?: string;
  @Column()
  password!: string;
  @OneToOne(() => UserProfile, (profile) => profile.user, {
    cascade: true,
  })
  profile!: UserProfile;
  @OneToMany(
    () => UserAuthentication,
    (authentication) => authentication.user,
    {
      cascade: true,
    },
  )
  userAuthentication!: UserAuthentication;
}
