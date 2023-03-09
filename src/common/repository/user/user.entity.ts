import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeepPartial,
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

export const UserEntityFixture: DeepPartial<UserEntity>[] = [
  {
    id: '12341234-1234-1234-123412341234',
    displayName: '테스트유저',
    profileImgURL: 'https://example.com/example.png',
    email: 'example@example.com',
    description: '테스트설명글',
  },
];

export async function loadUserEntityFixture() {
  const fixture = UserEntityFixture.map((data) => new UserEntity(data));
  await UserEntity.save(fixture);
}

@Entity('user')
export class UserEntity extends BaseEntity {
  constructor(_userEntity?: DeepPartial<UserEntity>) {
    super();
    if (_userEntity)
      for (const key of Object.keys(_userEntity)) {
        this[key] = _userEntity[key];
      }
  }

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

  @OneToOne(() => UserTwitchEntity, (userTwitch) => userTwitch.user, {
    cascade: true,
  })
  @JoinColumn({ name: 'twitch_id' })
  @ApiProperty({
    description: '트위치 사용자 연동 정보',
    type: UserTwitchEntity,
  })
  twitch: UserTwitchEntity;
  @OneToOne(() => UserGoogleEntity, (userGoogle) => userGoogle.user, {
    cascade: true,
  })
  @JoinColumn({ name: 'google_id' })
  @ApiProperty({
    description: '구글 사용자 연동 정보',
    type: UserGoogleEntity,
  })
  google: UserGoogleEntity;
  @OneToMany(() => MusicEntity, (music) => music.broadcaster, { cascade: true })
  musics: MusicEntity[];
  @OneToMany(() => MusicLikeEntity, (musicLike) => musicLike.viewer, {
    cascade: true,
  })
  musicLikes: MusicLikeEntity;
  @OneToMany(
    () => MusicLikeCountEntity,
    (musicLikeCount) => musicLikeCount.broadcaster,
    { cascade: true },
  )
  musicLikeCounts: MusicLikeCountEntity;
  @OneToOne(() => BookEntity, (book) => book.broadcaster, { cascade: true })
  book: BookEntity;
  @OneToMany(() => BookLikeEntity, (bookLike) => bookLike.viewer, {
    cascade: true,
  })
  bookLikes: BookLikeEntity[];
  @OneToMany(
    () => BookLikeCountEntity,
    (bookLikeCount) => bookLikeCount.broadcaster,
    { cascade: true },
  )
  bookLikeCounts: BookLikeCountEntity[];
}
