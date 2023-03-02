import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { BookEntity } from './book.entity';
import { MusicLikeEntity } from './music-like.entity';
import { MusicLikeCountEntity } from './music-like-count.entity';

enum EMusicPreviewType {
  YOUTUBE = 'YOUTUBE',
  SOUNDCLOUD = 'SOUNDCLOUD',
  FILe = 'FILE',
}

enum EMusicSouceType {
  YOUTUBE = 'YOUTUBE',
  SOUNDCLOUD = 'SOUNDCLOUD',
  SPOTIFY = 'SPOTIFY',
  FLAC = 'FLAC',
  WAV = 'WAV',
  MP3 = 'MP3',
}

@Entity('music')
export class MusicEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { name: 'msc_id' })
  @ApiProperty({
    description: '수록곡 고유 ID (number, autoincrement)',
    type: Number,
    example: 1234,
  })
  id: number;
  @Column({ name: 'msc_melon_id', nullable: true })
  @ApiProperty({
    description:
      '맬론 음원 ID. 맬론 음원 검색을 통해 추가된 음원일 경우 본 컬럼에 음원 ID가 포함됨.',
    type: String,
    nullable: true,
    example: 'melon_song_1234567890',
  })
  melonId: string;
  @Column({ name: 'msc_title' })
  @ApiProperty({
    description: '수록곡 제목',
    type: String,
    example: 'NIGHT DANCER',
  })
  title: string;
  @Column({ name: 'msc_artist' })
  @ApiProperty({
    description: '수록곡 원곡 가수명',
    type: String,
    example: 'imase',
  })
  artist: string;
  @Column({ name: 'msc_description' })
  @ApiProperty({
    description: '수록곡 설명',
    type: String,
    example: '이것은 설명 텍스트.',
  })
  description: string;
  @Column({ name: 'msc_preview_url', nullable: true })
  @ApiProperty({
    description: '수록곡 미리보기 URL',
    type: String,
    nullable: true,
    example: 'https://example.com',
  })
  previewURL: string;
  @Column('enum', {
    name: 'msc_preview_type',
    nullable: true,
    enum: EMusicPreviewType,
  })
  @ApiProperty({
    description: '수록곡 미리보기 URL 타입',
    enum: EMusicPreviewType,
    nullable: true,
    example: 'YOUTUBE',
  })
  previewType: keyof typeof EMusicPreviewType;
  @Column({ name: 'msc_thumnail_url' })
  @ApiProperty({
    description: '수록곡 썸네일(앨범아트) URL',
    type: String,
    example: 'https://example.com',
  })
  thumbnailURL: string;
  @Column({ name: 'msc_source_url', nullable: true })
  @ApiProperty({
    description: '수록곡 음원소스 URL',
    type: String,
    nullable: true,
    example: 'https://example.com',
  })
  sourceURL: string;
  @Column('enum', {
    name: 'msc_source_type',
    nullable: true,
    enum: EMusicSouceType,
  })
  @ApiProperty({
    description: '수록곡 음원소스 URL',
    enum: EMusicSouceType,
    nullable: true,
    example: 'YOUTUBE',
  })
  sourceType: keyof typeof EMusicSouceType;
  @Column('boolean', { name: 'msc_is_requestable', default: true })
  @ApiProperty({
    description: '수록곡 신청곡 요청 가능 여부',
    type: Boolean,
    example: true,
    default: true,
  })
  isRequestable: boolean;
  @Column('boolean', { name: 'msc_is_hide', default: false })
  @ApiProperty({
    description: '수록곡 숨김 여부',
    type: Boolean,
    example: false,
    default: false,
  })
  isHide: boolean;
  @Column('boolean', { name: 'msc_is_paid', default: false })
  @ApiProperty({
    description: '수록곡 유료신청곡 여부',
    type: Boolean,
    example: false,
    default: false,
  })
  isPaid: boolean;
  @CreateDateColumn()
  @ApiProperty({
    description: '수록곡 생성타임스템프(ISO8601, YYYY-MM-DDTHH:mm:ss.sssZ)',
    type: String,
    example: '2023-02-27T13:02:00.650Z',
  })
  createdAt: Date;
  @UpdateDateColumn()
  @ApiProperty({
    description: '수록곡 수정타임스템프(ISO8601, YYYY-MM-DDTHH:mm:ss.sssZ)',
    type: String,
    example: '2023-02-27T13:02:00.650Z',
  })
  updatedAt: Date;
  @DeleteDateColumn()
  @ApiProperty({
    description: '수록곡 삭제타임스템프(ISO8601, YYYY-MM-DDTHH:mm:ss.sssZ)',
    type: String,
    example: '2023-02-27T13:02:00.650Z',
  })
  deletedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: 'broadcaster_id' })
  @ApiProperty({
    description: '스트리머 사용자 ID (numeric string)',
    type: String,
    example: '123456789',
  })
  broadcaster: UserEntity;
  @ManyToOne(() => BookEntity, (book) => book.id)
  @JoinColumn({ name: 'bk_id' })
  @ApiProperty({
    description: '노래책 ID (number)',
    type: Number,
    example: 123456789,
  })
  book: BookEntity;
  @OneToMany(() => MusicLikeEntity, (musicLike) => musicLike.id)
  musicLikes: MusicLikeEntity;
  @OneToMany(() => MusicLikeCountEntity, (musicLikeCount) => musicLikeCount.id)
  musicLikeCounts: MusicLikeCountEntity;
}
