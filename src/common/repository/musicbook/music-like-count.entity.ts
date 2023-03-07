import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { BookEntity } from './book.entity';
import { MusicEntity } from './music.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('music-like-count')
export class MusicLikeCountEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  @ApiProperty({
    description: '수록곡 좋아요 집계 ID (number)',
    type: Number,
    example: 123456,
  })
  id: number;
  @Column('integer')
  @ApiProperty({
    description: '수록곡 좋아요 집계값',
    type: Number,
    example: 123456789,
  })
  count: number;
  @CreateDateColumn()
  @ApiProperty({
    description:
      '수록곡 좋아요 집계 생성타임스템프(ISO8601, YYYY-MM-DDTHH:mm:ss.sssZ)',
    type: String,
    example: '2023-02-27T13:02:00.650Z',
  })
  createdAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.musicLikeCounts)
  @JoinColumn({ name: 'broadcaster_id' })
  @ApiProperty({
    description: '수록곡 좋아요 집계에 해당하는 스트리머 사용자',
    type: () => UserEntity,
  })
  broadcaster: UserEntity;
  @ManyToOne(() => BookEntity, (book) => book.musicLikeCounts)
  @JoinColumn({ name: 'bk_id' })
  @ApiProperty({
    description: '수록곡의 노래책',
    type: () => BookEntity,
  })
  book: BookEntity;
  @ManyToOne(() => MusicEntity, (music) => music.musicLikeCounts)
  @JoinColumn({ name: 'msc_id' })
  @ApiProperty({
    description: '수록곡',
    type: () => MusicEntity,
  })
  music: MusicEntity;
}
