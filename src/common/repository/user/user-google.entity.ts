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

@Entity('user_google')
export class UserGoogleEntity extends BaseEntity {
  @PrimaryColumn({ name: 'google_id' })
  googleId: number;
  @Column({ name: 'google_name' })
  googleName: string;
  @Column({ name: 'google_display_name', nullable: true })
  googleDisplayName: string;
  @Column({ name: 'google_description', nullable: true })
  googleDescription: string;
  @Column({ name: 'google_profile_img_url' })
  googleProfileImgURL: string;
  @Column({ name: 'google_offline_img_url', nullable: true })
  googleOfflineImgURL: string;
  @Column({ name: 'google_email' })
  googleEmail: string;
  @Column({ type: 'timestamp', name: 'google_created_at', nullable: true })
  googleCreatedAt: Date;
  @Column({ name: 'google_type', nullable: true })
  googleType: string;
  @Column({ name: 'google_broadcaster_type', nullable: true })
  googleBroadcasterType: string;
  @Column({ name: 'google_access_token' })
  googleAccessToken: string;
  @Column({ name: 'google_refresh_token', nullable: true })
  googleRefreshToken: string;
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @OneToOne(() => UserEntity, (user) => user.google, { eager: true })
  user: UserEntity;
}
