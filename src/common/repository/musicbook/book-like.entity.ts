import {
  BaseEntity,
  CreateDateColumn,
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
  @PrimaryGeneratedColumn('increment', { name: 'id' })
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

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: 'viewer_id' })
  @ApiProperty({
    description: '노래책 좋아요를 누른 시청자 사용자 ID (numeric string)',
    type: String,
    example: '123456789',
  })
  viewer: UserEntity;
  @ManyToOne(() => BookEntity, (book) => book.id)
  @JoinColumn({ name: 'bk_id' })
  @ApiProperty({
    description: '노래책 ID (number)',
    type: Number,
    example: 123456789,
  })
  book: BookEntity;
}
