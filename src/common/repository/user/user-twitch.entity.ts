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
import { ApiProperty } from '@nestjs/swagger';

@Entity('user_twitch')
export class UserTwitchEntity extends BaseEntity {
  @PrimaryColumn({ name: 'twitch_id' })
  @ApiProperty({
    description: '트위치 사용자 ID (numeric string)',
    type: String,
    example: '12341234',
  })
  twitchId: string;
  @Column({ name: 'twitch_login' })
  @ApiProperty({
    description: '트위치 사용자 로그인 ID',
    type: String,
    example: 'twitch_login_id',
  })
  twitchLogin: string;
  @Column({ name: 'twitch_display_name', nullable: true })
  @ApiProperty({
    description: '트위치 사용자 이름',
    type: String,
    example: '홍길동',
  })
  twitchDisplayName: string;
  @Column({ name: 'twitch_description', nullable: true })
  @ApiProperty({
    description: '트위치 사용자 설명',
    type: String,
    example: '이건 설명 텍스트.',
  })
  twitchDescription: string;
  @Column({ name: 'twitch_profile_img_url' })
  @ApiProperty({
    description: '트위치 사용자 기본 프로필 이미지',
    type: String,
    example: 'http://example.com/example.png',
  })
  twitchProfileImgURL: string;
  @Column({ name: 'twitch_offline_img_url', nullable: true })
  @ApiProperty({
    description: '트위치 사용자 오프라인 프로필 이미지',
    type: String,
    example: 'http://example.com/example.png',
  })
  twitchOfflineImgURL: string;
  @Column({ name: 'twitch_email' })
  @ApiProperty({
    description: '트위치 사용자 이메일',
    type: String,
    example: 'example@example.com',
  })
  twitchEmail: string;
  @Column({ type: 'timestamp', name: 'twitch_created_at', nullable: true })
  @ApiProperty({
    description:
      '트위치 사용자 생성타임스템프(ISO8601, YYYY-MM-DDTHH:mm:ss.sssZ)',
    type: String,
    example: '2023-02-27T13:02:00.650Z',
  })
  twitchCreatedAt: Date;
  @Column({ name: 'twitch_type', nullable: true })
  @ApiProperty({
    description: '트위치 사용자 타입',
    type: String,
    example: '',
  })
  twitchType: string;
  @Column({ name: 'twitch_broadcaster_type', nullable: true })
  @ApiProperty({
    description: '트위치 사용자 방송타입',
    type: String,
    example: 'Just Chatting',
  })
  twitchBroadcasterType: string;
  @Column({ name: 'twitch_access_token' })
  @ApiProperty({
    description: '트위치 사용자 Access Token',
    type: String,
    example: 'awefohawoiehfaowefhoiawhieof',
  })
  twitchAccessToken: string;
  @Column({ name: 'twitch_refresh_token', nullable: true })
  @ApiProperty({
    description: '트위치 사용자 Refresh Token',
    type: String,
    example: 'awefohawoiehfaowefhoiawhieof',
  })
  twitchRefreshToken: string;
  @CreateDateColumn({ name: 'created_at' })
  @ApiProperty({
    description:
      '트위치 사용자 등록 생성타임스템프(ISO8601, YYYY-MM-DDTHH:mm:ss.sssZ)',
    type: String,
    example: '2023-02-27T13:02:00.650Z',
  })
  createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' })
  @ApiProperty({
    description:
      '트위치 사용자 등록 수정타임스템프(ISO8601, YYYY-MM-DDTHH:mm:ss.sssZ)',
    type: String,
    example: '2023-02-27T13:02:00.650Z',
  })
  updatedAt: Date;
  @DeleteDateColumn({ name: 'deleted_at' })
  @ApiProperty({
    description:
      '트위치 사용자 등록 삭제타임스템프(ISO8601, YYYY-MM-DDTHH:mm:ss.sssZ)',
    type: String,
    example: '2023-02-27T13:02:00.650Z',
  })
  deletedAt: Date;

  @OneToOne(() => UserEntity, (user) => user.twitch, { eager: true })
  user: UserEntity;
}

export type UserTwitchEntityDTO = Omit<
  UserTwitchEntity,
  'hasId' | 'recover' | 'reload' | 'remove' | 'save' | 'softRemove' | 'user'
>;
