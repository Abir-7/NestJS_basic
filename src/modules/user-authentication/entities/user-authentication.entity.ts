import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';

@Entity('user_authentication')
export class UserAuthentication extends BaseEntity {
  @Column()
  type!: string;
  @Column()
  code?: string;
  @Column()
  token?: string;
  @Column({ default: 'unused' })
  status!: string;
  @OneToOne(() => User, (user) => user.userAuthentication)
  @JoinColumn({ name: 'user_id' })
  user!: User;
}
