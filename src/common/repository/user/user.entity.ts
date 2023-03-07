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
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: '노래책 고유 사용자 ID (uuid v4)',
    type: String,
    example: '12341234-1234-1234-1234-123412341234',
  })
  id: string;
  @Column()
  @ApiProperty({
    description: '노래책 고유 사용자 이름',
    type: String,
    example: '홍길동',
  })
  displayName: string;
  @Column('text')
  @ApiProperty({
    description: '노래책 고유 사용자 프로필 이미지',
    type: String,
    example: 'http://example.com/example.png',
  })
  profileImgURL: string;
  @Column({ unique: true })
  @ApiProperty({
    description: '노래책 고유 사용자 이메일',
    type: String,
    example: 'example@example.com',
  })
  email: string;
  @Column('text')
  @ApiProperty({
    description: '노래책 고유 사용자 설명',
    type: String,
    example: '이것은 설명 텍스트.',
  })
  description: string;
  @CreateDateColumn()
  @ApiProperty({
    description:
      '노래책 고유 사용자 생성타임스템프(ISO8601, YYYY-MM-DDTHH:mm:ss.sssZ)',
    type: String,
    example: '2023-02-27T13:02:00.650Z',
  })
  createdAt: Date;
  @UpdateDateColumn()
  @ApiProperty({
    description:
      '노래책 고유 사용자 수정타임스템프(ISO8601, YYYY-MM-DDTHH:mm:ss.sssZ)',
    type: String,
    nullable: true,
    example: '2023-02-27T13:02:00.650Z',
  })
  updatedAt: Date;
  @DeleteDateColumn()
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
  @OneToMany(() => MusicEntity, (music) => music.broadcaster)
  @ApiProperty({
    description: '수록곡 배열',
    type: () => [MusicEntity],
  })
  musics: MusicEntity[];
  @OneToMany(() => MusicLikeEntity, (musicLike) => musicLike.viewer)
  @ApiProperty({
    description: '수록곡 좋아요 배열',
    type: () => [MusicLikeEntity],
  })
  musicLikes: MusicLikeEntity;
  @OneToMany(
    () => MusicLikeCountEntity,
    (musicLikeCount) => musicLikeCount.broadcaster,
  )
  @ApiProperty({
    description: '수록곡 좋아요 집계 배열',
    type: () => [MusicLikeCountEntity],
  })
  musicLikeCounts: MusicLikeCountEntity;
  @OneToOne(() => BookEntity, (book) => book.broadcaster)
  @ApiProperty({
    description: '노래책',
    type: () => BookEntity,
  })
  book: BookEntity;
  @OneToMany(() => BookLikeEntity, (bookLike) => bookLike.viewer)
  @ApiProperty({
    description: '노래책 좋아요 배열',
    type: () => [BookLikeEntity],
  })
  bookLikes: BookLikeEntity[];
  @OneToMany(
    () => BookLikeCountEntity,
    (bookLikeCount) => bookLikeCount.broadcaster,
  )
  @ApiProperty({
    description: '노래책 좋아요 집계 배열',
    type: () => [BookLikeCountEntity],
  })
  bookLikeCounts: BookLikeCountEntity[];
}
