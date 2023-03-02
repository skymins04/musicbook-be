import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserTwitchEntity } from './user-twitch.entity';
import { UserGoogleEntity } from './user-google.entity';
import { ApiProperty } from '@nestjs/swagger';
import { MusicEntity } from '../musicbook/music.entity';
import { BookEntity } from '../musicbook/book.entity';
import { MusicLikeEntity } from '../musicbook/music-like.entity';
import { BookLikeEntity } from '../musicbook/book-like.entity';
import { MusicLikeCountEntity } from '../musicbook/music-like-count.entity';
import { BookLikeCountEntity } from '../musicbook/book-like-count.entity';

@Entity('user')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  @ApiProperty({
    description: '노래책 고유 사용자 ID (uuid v4)',
    type: String,
    example: '12341234-1234-1234-1234-123412341234',
  })
  id: string;
  @Column({ name: 'display_name' })
  @ApiProperty({
    description: '노래책 고유 사용자 이름',
    type: String,
    example: '홍길동',
  })
  displayName: string;
  @Column({ name: 'profile_img_url', length: 512 })
  @ApiProperty({
    description: '노래책 고유 사용자 프로필 이미지',
    type: String,
    example: 'http://example.com/example.png',
  })
  profileImgURL: string;
  @Column({ name: 'email', unique: true })
  @ApiProperty({
    description: '노래책 고유 사용자 이메일',
    type: String,
    example: 'example@example.com',
  })
  email: string;
  @Column({ name: 'description', length: 512 })
  @ApiProperty({
    description: '노래책 고유 사용자 설명',
    type: String,
    example: '이것은 설명 텍스트.',
  })
  description: string;
  @CreateDateColumn({ name: 'created_at' })
  @ApiProperty({
    description:
      '노래책 고유 사용자 생성타임스템프(ISO8601, YYYY-MM-DDTHH:mm:ss.sssZ)',
    type: String,
    example: '2023-02-27T13:02:00.650Z',
  })
  createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' })
  @ApiProperty({
    description:
      '노래책 고유 사용자 수정타임스템프(ISO8601, YYYY-MM-DDTHH:mm:ss.sssZ)',
    type: String,
    nullable: true,
    example: '2023-02-27T13:02:00.650Z',
  })
  updatedAt: Date;
  @DeleteDateColumn({ name: 'deleted_at' })
  @ApiProperty({
    description:
      '노래책 고유 사용자 삭제타임스템프(ISO8601, YYYY-MM-DDTHH:mm:ss.sssZ)',
    type: String,
    nullable: true,
    example: '2023-02-27T13:02:00.650Z',
  })
  deletedAt: Date;

  @OneToOne(() => UserTwitchEntity, (userTwitch) => userTwitch.user)
  @JoinColumn({ name: 'twitch_id' })
  @ApiProperty({
    description: '트위치 사용자 연동 정보',
    type: UserTwitchEntity,
  })
  twitch: UserTwitchEntity;
  @OneToOne(() => UserGoogleEntity, (userGoogle) => userGoogle.user)
  @JoinColumn({ name: 'google_id' })
  @ApiProperty({
    description: '구글 사용자 연동 정보',
    type: UserGoogleEntity,
  })
  google: UserGoogleEntity;
  @OneToMany(() => MusicEntity, (music) => music.id)
  musics: MusicEntity;
  @OneToMany(() => MusicLikeEntity, (musicLike) => musicLike.id)
  musicLikes: MusicLikeEntity;
  @OneToMany(() => MusicLikeCountEntity, (musicLikeCount) => musicLikeCount.id)
  musicLikeCounts: MusicLikeCountEntity;
  @OneToOne(() => BookEntity, (book) => book.id)
  book: BookEntity;
  @OneToMany(() => BookLikeEntity, (bookLike) => bookLike.id)
  bookLikes: BookLikeEntity;
  @OneToMany(() => BookLikeCountEntity, (bookLikeCount) => bookLikeCount.id)
  bookLikeCounts: BookLikeCountEntity;
}
