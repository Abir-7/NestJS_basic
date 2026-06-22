import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserProfile } from './user-profile.entity';

@Entity('user_profile_photo')
export class UserProfilePhoto {
  @PrimaryGeneratedColumn()
  id!: string;
  @Column({ name: 'image_id' })
  imageId?: string;
  @Column({ name: 'image' })
  image?: string;
  @OneToOne(() => UserProfile, (userProfile) => userProfile.photo)
  @JoinColumn({ name: 'user_profile_id' })
  userProfile!: UserProfile;
}
