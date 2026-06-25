import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { UserProfilePhoto } from './user-profile-photo';
import { User } from '../../users/entities/user.entity';

@Entity('user_profiles')
export class UserProfile extends BaseEntity {
  @Column({ name: 'full_name' })
  fullName!: string;
  @Column({ nullable: true })
  bio!: string;
  @OneToOne(() => UserProfilePhoto, (photo) => photo.userProfile, {
    cascade: true,
  })
  photo!: UserProfilePhoto;
  @OneToOne(() => User, (user) => user.profile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;
}
