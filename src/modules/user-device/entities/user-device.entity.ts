import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';

@Entity('user_devices')
export class UserDevices extends BaseEntity {
  @Column({ name: 'ip_address', type: 'varchar', length: 45, nullable: true })
  ipAddress?: string;

  @Column({
    name: 'device_fingerprint',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  deviceFingerprint?: string;

  @Column({ name: 'os_type', type: 'varchar', length: 100, nullable: true })
  osType?: string;

  @Column({
    name: 'device_model',
    type: 'varchar',
    length: 150,
    nullable: true,
  })
  deviceModel?: string;

  @Column({ name: 'is_emulator', type: 'boolean', default: false })
  isEmulator!: boolean;

  @Column({
    name: 'is_loggedin',
    type: 'boolean',
    default: false,
  })
  isLoggedIn!: boolean;

  @ManyToOne(() => User, (user) => user.userDevices, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user!: User;
}
