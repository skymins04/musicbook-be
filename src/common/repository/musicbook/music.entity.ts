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
import { MusicSourceOriginalEntity } from './music-source-original.entity';
import { MusicSourceMelonEntity } from './music-source-melon.entity';

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
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: '수록곡 고유 ID (uuidv4)',
    type: String,
    example: '12341234-1234-1234-123412341234',
  })
  id: string;

  @Column()
  @ApiProperty({
    description: '수록곡 제목',
    type: String,
    example: '수록곡 제목',
  })
  title: string;

  @Column()
  @ApiProperty({
    description: '수록곡 카테고리',
    type: String,
    example: '수록곡 카테고리',
  })
  category: string;

  @Column({ nullable: true })
  @ApiProperty({
    description: '수록곡 설명',
    type: String,
    nullable: true,
    example: '이것은 설명 텍스트.',
  })
  description: string;

  @Column({ nullable: true })
  @ApiProperty({
    description: '수록곡 미리보기 URL',
    type: String,
    nullable: true,
    example: 'https://example.com',
  })
  previewURL: string;

  @Column('enum', {
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

  @Column({ nullable: true })
  @ApiProperty({
    description: '수록곡 음원소스 URL',
    type: String,
    nullable: true,
    example: 'https://example.com',
  })
  sourceURL: string;

  @Column('enum', {
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

  @Column('boolean', { default: true })
  @ApiProperty({
    description: '수록곡 신청곡 요청 가능 여부',
    type: Boolean,
    example: true,
    default: true,
  })
  isRequestable: boolean;
  @Column('boolean', { default: false })
  @ApiProperty({
    description: '수록곡 숨김 여부',
    type: Boolean,
    example: false,
    default: false,
  })
  isHide: boolean;
  @Column('boolean', { default: false })
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
    nullable: true,
    example: '2023-02-27T13:02:00.650Z',
  })
  deletedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.musics)
  @JoinColumn({ name: 'broadcaster_id' })
  @ApiProperty({
    description: '스트리머 사용자',
    type: () => UserEntity,
  })
  broadcaster: UserEntity;
  @ManyToOne(() => BookEntity, (book) => book.musics)
  @JoinColumn({ name: 'bk_id' })
  @ApiProperty({
    description: '노래책',
    type: () => BookEntity,
  })
  book: BookEntity;
  @ManyToOne(
    () => MusicSourceOriginalEntity,
    (musicSourceOriginal) => musicSourceOriginal.musics,
  )
  @JoinColumn({ name: 'source_original_id' })
  @ApiProperty({
    description: '노래책 고유 음원',
    type: () => MusicSourceOriginalEntity,
  })
  musicSourceOriginal: MusicSourceOriginalEntity;
  @ManyToOne(
    () => MusicSourceMelonEntity,
    (musicSourceMelon) => musicSourceMelon.musics,
  )
  @JoinColumn({ name: 'source_melon_id' })
  @ApiProperty({
    description: 'melon 음원',
    type: () => MusicSourceMelonEntity,
  })
  musicSourceMelon: MusicSourceMelonEntity;
  @OneToMany(() => MusicLikeEntity, (musicLike) => musicLike.music)
  @ApiProperty({
    description: '노래책 좋아요 배열',
    type: () => [MusicLikeEntity],
  })
  musicLikes: MusicLikeEntity[];
  @OneToMany(
    () => MusicLikeCountEntity,
    (musicLikeCount) => musicLikeCount.music,
  )
  @ApiProperty({
    description: '노래책 좋아요 집계 배열',
    type: () => [MusicLikeCountEntity],
  })
  musicLikeCounts: MusicLikeCountEntity[];
}
