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
  @Column({ name: 'image_id', nullable: true })
  imageId?: string;
  @Column({ name: 'image', nullable: true })
  image?: string;
  @OneToOne(() => UserProfile, (userProfile) => userProfile.photo, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_profile_id' })
  userProfile!: UserProfile;
}
