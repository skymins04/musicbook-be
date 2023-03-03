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
import { ApiProperty } from '@nestjs/swagger';

@Entity('book-like-entity')
export class BookLikeCountEntity extends BaseEntity {
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

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: 'broadcaster_id' })
  @ApiProperty({
    description:
      '노래책 좋아요 집계에 해당하는 스트리머 사용자 ID (numeric string)',
    type: String,
    example: '123456789',
  })
  broadcaster: UserEntity;
  @ManyToOne(() => BookEntity, (book) => book.id)
  @JoinColumn({ name: 'bk_id' })
  @ApiProperty({
    description: '노래책 ID (uuidv4)',
    type: String,
    example: '12341234-1234-1234-123412341234',
  })
  book: BookEntity;
}