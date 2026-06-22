import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { UserProfilePhoto } from './user-profile-photo';
import { User } from '../../users/entities/user.entity';

@Entity('user_profiles')
export class UserProfile extends BaseEntity {
  @Column({ name: 'full_name' })
  fullName!: string;
  @Column({ name: 'bio' })
  bio!: string;
  @OneToOne(() => UserProfilePhoto, (photo) => photo.userProfile)
  photo!: UserProfilePhoto;
  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn({ name: 'user_id' })
  user!: User;
}
