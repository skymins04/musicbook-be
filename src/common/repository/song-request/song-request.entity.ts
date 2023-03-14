import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeepPartial,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MusicEntity } from '../musicbook/music.entity';
import { UserEntity } from '../user/user.entity';
import { BookEntity } from '../musicbook/book.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('song-request')
export class SongRequestEntity extends BaseEntity {
  constructor(_songRequest?: DeepPartial<SongRequestEntity>) {
    super();
    if (_songRequest) {
      for (const key of Object.keys(_songRequest)) {
        this[key] = _songRequest[key];
      }
    }
  }

  @PrimaryGeneratedColumn('increment')
  @ApiProperty({
    description: '노래책 신청곡 ID (number)',
    type: Number,
    example: 12345,
  })
  id: number;
  @Column('boolean', { default: false })
  @ApiProperty({
    description: '노래책 신청곡 유료 여부',
    type: Boolean,
    example: false,
  })
  isPaid: boolean;
  @Column('boolean', { default: false })
  @ApiProperty({
    description: '노래책 신청곡 재생 상태',
    type: Boolean,
    example: false,
  })
  isPlayed: boolean;
  @Column('boolean', { default: false })
  @ApiProperty({
    description: '노래책 신청곡 재생완료 여부',
    type: Boolean,
    example: false,
  })
  isCompleted: boolean;
  @CreateDateColumn()
  @ApiProperty({
    description:
      '노래책 신청곡 생성타임스템프(ISO8601, YYYY-MM-DDTHH:mm:ss.sssZ)',
    type: String,
    example: '2023-02-27T13:02:00.650Z',
  })
  createdAt: Date;
  @UpdateDateColumn()
  @ApiProperty({
    description:
      '노래책 신청곡 수정타임스템프(ISO8601, YYYY-MM-DDTHH:mm:ss.sssZ)',
    type: String,
    example: '2023-02-27T13:02:00.650Z',
  })
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.songRequests)
  @JoinColumn({ name: 'viewer_id' })
  @ApiProperty({
    description: '신청자 사용자',
    type: () => UserEntity,
  })
  viewer: UserEntity;
  @ManyToOne(() => UserEntity, (user) => user.songRequests)
  @JoinColumn({ name: 'broadcaster_id' })
  @ApiProperty({
    description: '스트리머 사용자',
    type: () => UserEntity,
  })
  broadcaster: UserEntity;
  @ManyToOne(() => MusicEntity, (music) => music.songRequests)
  @JoinColumn({ name: 'music_id' })
  @ApiProperty({
    description: '수록곡',
    type: () => MusicEntity,
  })
  music: MusicEntity;
  @ManyToOne(() => BookEntity, (book) => book.songRequests)
  @JoinColumn({ name: 'book_id' })
  @ApiProperty({
    description: '노래책',
    type: () => BookEntity,
  })
  book: BookEntity;
}
