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
  @Column({ name: 'google_display_name', nullable: true })
  googleDisplayName: string;
  @Column({ name: 'google_profile_img_url' })
  googleProfileImgURL: string;
  @Column({ name: 'google_email' })
  googleEmail: string;
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @OneToOne(() => UserEntity, (user) => user.google, { eager: true })
  user: UserEntity;
}

export type UserGoogleEntityDTO = Omit<
  UserGoogleEntity,
  'hasId' | 'recover' | 'reload' | 'remove' | 'save' | 'softRemove' | 'user'
>;
