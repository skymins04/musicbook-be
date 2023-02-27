import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserTwitchEntity } from './user-twitch.entity';
import { UserGoogleEntity } from './user-google.entity';

@Entity('user')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;
  @OneToOne(() => UserTwitchEntity, (userTwitch) => userTwitch.user, {
    cascade: true,
  })
  @JoinColumn({ name: 'twitch_id' })
  twitch: UserTwitchEntity;
  @JoinColumn({ name: 'google_id' })
  google: UserGoogleEntity;
  @Column({ name: 'display_name' })
  displayName: string;
  @Column({ name: 'profile_img_url', length: 512 })
  profileImgURL: string;
  @Column({ name: 'email', unique: true })
  email: string;
  @Column({ name: 'description', length: 512 })
  description: string;
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date | null;
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date | null;
}
