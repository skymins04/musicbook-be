import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeepPartial,
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
import { EMusicMRType, EMusicPreviewType } from './musicbook.enum';

@Entity('music')
export class MusicEntity extends BaseEntity {
  constructor(_musicEntity?: DeepPartial<MusicEntity>) {
    super();
    if (_musicEntity)
      for (const key of Object.keys(_musicEntity)) {
        this[key] = _musicEntity[key];
      }
  }

  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: '수록곡 고유 ID (uuidv4)',
    type: String,
    example: '12341234-1234-1234-1234-123412341234',
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
    description: '수록곡 MR URL',
    type: String,
    nullable: true,
    example: 'https://example.com',
  })
  mrURL: string;

  @Column('enum', {
    nullable: true,
    enum: EMusicMRType,
  })
  @ApiProperty({
    description: '수록곡 MR URL',
    enum: EMusicMRType,
    nullable: true,
    example: 'YOUTUBE',
  })
  mrType: keyof typeof EMusicMRType;

  @Column('integer', { default: 0 })
  @ApiProperty({
    description: '노래책 좋아요 개수',
    type: Number,
    example: 100,
  })
  likeCount: number;

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

  @ManyToOne(() => UserEntity, (user) => user.musics, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'broadcaster_id' })
  @ApiProperty({
    description: '스트리머 사용자',
    type: () => UserEntity,
  })
  broadcaster: UserEntity;
  @ManyToOne(() => BookEntity, (book) => book.musics, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bk_id' })
  @ApiProperty({
    description: '노래책',
    type: () => BookEntity,
  })
  book: BookEntity;
  @ManyToOne(
    () => MusicSourceOriginalEntity,
    (musicSourceOriginal) => musicSourceOriginal.musics,
    { onDelete: 'CASCADE' },
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
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'source_melon_id' })
  @ApiProperty({
    description: 'melon 음원',
    type: () => MusicSourceMelonEntity,
  })
  musicSourceMelon: MusicSourceMelonEntity;
  @OneToMany(() => MusicLikeEntity, (musicLike) => musicLike.music, {
    cascade: true,
  })
  @ApiProperty({
    description: '노래책 좋아요 배열',
    type: () => [MusicLikeEntity],
  })
  musicLikes: MusicLikeEntity[];
  @OneToMany(
    () => MusicLikeCountEntity,
    (musicLikeCount) => musicLikeCount.music,
    { cascade: true },
  )
  @ApiProperty({
    description: '노래책 좋아요 집계 배열',
    type: () => [MusicLikeCountEntity],
  })
  musicLikeCounts: MusicLikeCountEntity[];
}
