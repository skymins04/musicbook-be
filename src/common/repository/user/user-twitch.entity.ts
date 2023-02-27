import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('user_twitch')
export class UserTwitchEntity extends BaseEntity {
  @PrimaryColumn({ name: 'twitch_id' })
  twitchId: string;
  @Column({ name: 'twitch_login' })
  twitchLogin: string;
  @Column({ name: 'twitch_display_name', nullable: true })
  twitchDisplayName: string;
  @Column({ name: 'twitch_description', nullable: true })
  twitchDescription: string;
  @Column({ name: 'twitch_profile_img_url' })
  twitchProfileImgURL: string;
  @Column({ name: 'twitch_offline_img_url', nullable: true })
  twitchOfflineImgURL: string;
  @Column({ name: 'twitch_email' })
  twitchEmail: string;
  @Column({ type: 'timestamp', name: 'twitch_created_at', nullable: true })
  twitchCreatedAt: Date;
  @Column({ name: 'twitch_type', nullable: true })
  twitchType: string;
  @Column({ name: 'twitch_broadcaster_type', nullable: true })
  twitchBroadcasterType: string;
  @Column({ name: 'twitch_access_token' })
  twitchAccessToken: string;
  @Column({ name: 'twitch_refresh_token', nullable: true })
  twitchRefreshToken: string;
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @OneToOne(() => UserEntity, (user) => user.twitch, { eager: true })
  user: UserEntity;
}

export type UserTwitchEntityDTO = Omit<
  UserTwitchEntity,
  'hasId' | 'recover' | 'reload' | 'remove' | 'save' | 'softRemove' | 'user'
>;
