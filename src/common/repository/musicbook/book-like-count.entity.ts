import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeepPartial,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { BookEntity } from './book.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('book-like-count')
export class BookLikeCountEntity extends BaseEntity {
  constructor(_bookLikeCountEntity?: DeepPartial<BookLikeCountEntity>) {
    super();
    if (_bookLikeCountEntity)
      for (const key of Object.keys(_bookLikeCountEntity)) {
        this[key] = _bookLikeCountEntity[key];
      }
  }

  @PrimaryGeneratedColumn('increment')
  id: number;
  @ApiProperty({
    description: '노래책 좋아요 집계 ID (number)',
    type: Number,
    example: 123456,
  })
  @Column('integer')
  @ApiProperty({
    description: '노래책 좋아요 집계값',
    type: Number,
    example: 123456789,
  })
  count: number;
  @CreateDateColumn()
  @ApiProperty({
    description:
      '노래책 좋아요 집계 생성타임스템프(ISO8601, YYYY-MM-DDTHH:mm:ss.sssZ)',
    type: String,
    example: '2023-02-27T13:02:00.650Z',
  })
  createdAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.bookLikeCounts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'broadcaster_id' })
  @ApiProperty({
    description: '노래책 좋아요 집계에 해당하는 스트리머 사용자',
    type: () => UserEntity,
  })
  broadcaster: UserEntity;
  @ManyToOne(() => BookEntity, (book) => book.bookLikeCounts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'bk_id' })
  @ApiProperty({
    description: '노래책',
    type: () => BookEntity,
  })
  book: BookEntity;
}
