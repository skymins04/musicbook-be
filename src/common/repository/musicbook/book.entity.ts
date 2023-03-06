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
import { UserEntity } from '../user/user.entity';
import { MusicEntity } from './music.entity';
import { MusicLikeEntity } from './music-like.entity';
import { BookLikeEntity } from './book-like.entity';
import { MusicLikeCountEntity } from './music-like-count.entity';
import { BookLikeCountEntity } from './book-like-count.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('book')
export class BookEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: '노래책 고유 ID (uuidv4)',
    type: String,
    example: '12341234-1234-1234-123412341234',
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

  @OneToOne(() => UserEntity, (user) => user.book)
  @JoinColumn({ name: 'broadcaster_id' })
  @ApiProperty({
    description: '스트리머 사용자 ID (numeric string)',
    type: String,
    example: '123456789',
  })
  broadcaster: UserEntity;
  @OneToMany(() => MusicEntity, (music) => music.book)
  musics: MusicEntity[];
  @OneToMany(() => MusicLikeEntity, (musicLike) => musicLike.book)
  musicLikes: MusicLikeEntity[];
  @OneToMany(
    () => MusicLikeCountEntity,
    (musicLikeCount) => musicLikeCount.book,
  )
  musicLikeCounts: MusicLikeCountEntity[];
  @OneToMany(() => BookLikeEntity, (bookLike) => bookLike.book)
  bookLikes: BookLikeEntity[];
  @OneToMany(() => BookLikeCountEntity, (bookLikeCount) => bookLikeCount.book)
  bookLikeCounts: BookLikeCountEntity[];
}
