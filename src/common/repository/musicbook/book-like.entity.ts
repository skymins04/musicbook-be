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
import { BookEntity } from './book.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('book-like')
export class BookLikeEntity extends BaseEntity {
  constructor(_bookLikeEntity?: DeepPartial<BookLikeEntity>) {
    super();
    if (_bookLikeEntity)
      for (const key of Object.keys(_bookLikeEntity)) {
        this[key] = _bookLikeEntity[key];
      }
  }

  @PrimaryGeneratedColumn('increment')
  @ApiProperty({
    description: '노래책 좋아요 ID (number)',
    type: Number,
    example: 123456,
  })
  id: number;
  @CreateDateColumn()
  @ApiProperty({
    description:
      '노래책 좋아요 생성타임스템프(ISO8601, YYYY-MM-DDTHH:mm:ss.sssZ)',
    type: String,
    example: '2023-02-27T13:02:00.650Z',
  })
  createdAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.bookLikes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'viewer_id' })
  @ApiProperty({
    description: '노래책 좋아요를 누른 시청자 사용자',
    type: () => UserEntity,
  })
  viewer: UserEntity;
  @ManyToOne(() => BookEntity, (book) => book.bookLikes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'bk_id' })
  @ApiProperty({
    description: '노래책',
    type: () => BookEntity,
  })
  book: BookEntity;
}
