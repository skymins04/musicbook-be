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
import { UserEntity } from '../user/user.entity';
import { MusicEntity } from './music.entity';
import { MusicLikeEntity } from './music-like.entity';
import { BookLikeEntity } from './book-like.entity';
import { MusicLikeCountEntity } from './music-like-count.entity';
import { BookLikeCountEntity } from './book-like-count.entity';
import { ApiProperty } from '@nestjs/swagger';
import { SongRequestEntity } from '../song-request/song-request.entity';
import { SongRequestBlacklistEntity } from '../song-request/song-request-blacklist.entity';

export const BookEntityFixture: DeepPartial<BookEntity>[] = [
  {
    id: '12341234-1234-1234-123412341234',
    customId: '@test',
    title: '테스트노래책',
    description: '테스트설명글',
    requestCommandPrefix: '!노래책',
    thumbnailURL: 'https://example.com/example.png',
    backgroundImgURL: 'https://example.com/example.png',
    likeCount: 0,
    isRequestable: true,
    isHide: false,
    isPaid: false,
    broadcaster: {
      id: '12341234-1234-1234-123412341234',
    },
  },
];

export async function loadBookEntityFixture() {
  const fixture = BookEntityFixture.map((data) => new BookEntity(data));
  await BookEntity.save(fixture);
}

@Entity('book')
export class BookEntity extends BaseEntity {
  constructor(_bookEntity?: DeepPartial<BookEntity>) {
    super();
    if (_bookEntity)
      for (const key of Object.keys(_bookEntity)) {
        this[key] = _bookEntity[key];
      }
  }

  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: '노래책 고유 ID (uuidv4)',
    type: String,
    example: '12341234-1234-1234-1234-123412341234',
  })
  id: string;
  @Column({ nullable: true, unique: true })
  @ApiProperty({
    description: '노래책 커스텀 ID (string)',
    type: String,
    example: 'custom-id',
  })
  customId: string;
  @Column()
  @ApiProperty({
    description: '노래책 제목',
    type: String,
    example: '개쩌는노래책제목',
  })
  title: string;
  @Column()
  @ApiProperty({
    description: '노래책 설명',
    type: String,
    example: '이것은 설명 텍스트.',
  })
  description: string;
  @Column({ default: '!노래책' })
  @ApiProperty({
    description: '노래책 신청곡 명령어 접두어',
    type: String,
    example: '!노래책',
  })
  requestCommandPrefix: string;
  @Column()
  @ApiProperty({
    description: '노래책 썸네일 이미지 URL',
    type: String,
    example: 'https://example.com/example.png',
  })
  thumbnailURL: string;
  @Column()
  @ApiProperty({
    description: '노래책 배경 커버이미지 URL',
    type: String,
    example: 'https://example.com/example.png',
  })
  backgroundImgURL: string;
  @Column('boolean', { default: true })
  @ApiProperty({
    description: '노래책 신청곡 허용 여부',
    type: Boolean,
    example: true,
  })
  isRequestable: boolean;
  @Column('integer', { default: 0 })
  @ApiProperty({
    description: '노래책 좋아요 개수',
    type: Number,
    example: 100,
  })
  likeCount: number;
  @Column('boolean', { default: false })
  @ApiProperty({
    description: '노래책 숨김 여부',
    type: Boolean,
    example: false,
  })
  isHide: boolean;
  @Column('boolean', { default: false })
  @ApiProperty({
    description: '노래책 유료신청곡 여부',
    type: Boolean,
    example: false,
  })
  isPaid: boolean;
  @Column('boolean', { default: false })
  @ApiProperty({
    description: '대기열 내 동일 수록곡 중복신청 허용 여부',
    type: Boolean,
    example: false,
  })
  isAllowDuplicateRequest: boolean;
  @CreateDateColumn()
  @ApiProperty({
    description: '노래책 생성타임스템프(ISO8601, YYYY-MM-DDTHH:mm:ss.sssZ)',
    type: String,
    example: '2023-02-27T13:02:00.650Z',
  })
  createdAt: Date;
  @UpdateDateColumn()
  @ApiProperty({
    description: '노래책 수정타임스템프(ISO8601, YYYY-MM-DDTHH:mm:ss.sssZ)',
    type: String,
    example: '2023-02-27T13:02:00.650Z',
  })
  updatedAt: Date;
  @DeleteDateColumn()
  @ApiProperty({
    description: '노래책 삭제타임스템프(ISO8601, YYYY-MM-DDTHH:mm:ss.sssZ)',
    type: String,
    nullable: true,
    example: '2023-02-27T13:02:00.650Z',
  })
  deletedAt: Date;

  @OneToOne(() => UserEntity, (user) => user.book, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'broadcaster_id' })
  @ApiProperty({
    description: '스트리머 사용자',
    type: () => UserEntity,
  })
  broadcaster: UserEntity;
  @OneToMany(() => MusicEntity, (music) => music.book, { cascade: true })
  @ApiProperty({
    description: '수록곡 배열',
    type: () => [MusicEntity],
  })
  musics: MusicEntity[];
  @OneToMany(() => MusicLikeEntity, (musicLike) => musicLike.book, {
    cascade: true,
  })
  musicLikes: MusicLikeEntity[];
  @OneToMany(
    () => MusicLikeCountEntity,
    (musicLikeCount) => musicLikeCount.book,
    { cascade: true },
  )
  musicLikeCounts: MusicLikeCountEntity[];
  @OneToMany(() => BookLikeEntity, (bookLike) => bookLike.book, {
    cascade: true,
  })
  bookLikes: BookLikeEntity[];
  @OneToMany(() => BookLikeCountEntity, (bookLikeCount) => bookLikeCount.book, {
    cascade: true,
  })
  bookLikeCounts: BookLikeCountEntity[];
  @OneToMany(() => SongRequestEntity, (request) => request.book, {
    cascade: true,
  })
  songRequests: SongRequestEntity[];
  @OneToMany(() => SongRequestBlacklistEntity, (blacklist) => blacklist.user)
  songRequestBlacklist: SongRequestBlacklistEntity[];
}
