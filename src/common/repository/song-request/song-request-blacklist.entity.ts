import {
  BaseEntity,
  CreateDateColumn,
  DeepPartial,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { BookEntity } from '../musicbook/book.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('song-request-blacklist')
export class SongRequestBlacklistEntity extends BaseEntity {
  constructor(_songRequestBlacklist?: DeepPartial<SongRequestBlacklistEntity>) {
    super();
    if (_songRequestBlacklist) {
      for (const key of Object.keys(_songRequestBlacklist)) {
        this[key] = _songRequestBlacklist[key];
      }
    }
  }

  @PrimaryGeneratedColumn('increment')
  @ApiProperty({
    description: '노래책 신청곡 요청 블랙리스트 유저 ID (number)',
    type: Number,
    example: 12345,
  })
  id: number;
  @CreateDateColumn()
  @ApiProperty({
    description:
      '노래책 신청곡 요청 블랙리스트 유저 생성타임스템프(ISO8601, YYYY-MM-DDTHH:mm:ss.sssZ)',
    type: String,
    example: '2023-02-27T13:02:00.650Z',
  })
  createdAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.songRequestBlacklist)
  @JoinColumn({ name: 'user_id' })
  @ApiProperty({
    description: '노래책 사용자',
    type: () => UserEntity,
  })
  user: UserEntity;

  @ManyToOne(() => BookEntity, (book) => book.songRequestBlacklist)
  @JoinColumn({ name: 'book_id' })
  @ApiProperty({
    description: '노래책',
    type: () => BookEntity,
  })
  book: BookEntity;
}
