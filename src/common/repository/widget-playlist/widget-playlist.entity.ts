import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeepPartial,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { BookEntity } from '../musicbook/book.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('widget-playlist')
export class WidgetPlaylistEntity extends BaseEntity {
  constructor(_widget?: DeepPartial<WidgetPlaylistEntity>) {
    super();
    if (_widget)
      for (const key of Object.keys(_widget)) this[key] = _widget[key];
  }

  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: '플레이리스트 위젯 ID (uuidv4)',
    type: String,
    example: '12341234-1234-1234-1234-123412341234',
  })
  id: string;

  @Column({ default: '새 플레이리스트 위젯' })
  @ApiProperty({
    description: '플레이리스트 위젯 제목',
    type: String,
    example: '플레이리스트 위젯 제목',
  })
  title: string;

  @Column({ default: 'BASIC' })
  @ApiProperty({
    description: '플레이리스트 위젯 CSS 테마',
    type: String,
    example: 'BASIC',
  })
  theme: string;

  @Column('integer', { default: 24 })
  @ApiProperty({
    description: '플레이리스트 위젯 폰트 사이즈',
    type: Number,
    example: 24,
  })
  fontSize: number;

  @CreateDateColumn()
  @ApiProperty({
    description:
      '플레이리스트 위젯 생성타임스템프(ISO8601, YYYY-MM-DDTHH:mm:ss.sssZ)',
    type: String,
    example: '2023-02-27T13:02:00.650Z',
  })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({
    description:
      '플레이리스트 위젯 수정타임스템프(ISO8601, YYYY-MM-DDTHH:mm:ss.sssZ)',
    type: String,
    nullable: true,
    example: '2023-02-27T13:02:00.650Z',
  })
  updatedAt: Date;

  @DeleteDateColumn()
  @ApiProperty({
    description:
      '플레이리스트 위젯 삭제타임스템프(ISO8601, YYYY-MM-DDTHH:mm:ss.sssZ)',
    type: String,
    nullable: true,
    example: '2023-02-27T13:02:00.650Z',
  })
  deletedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.widgetPlaylists)
  @JoinColumn({ name: 'user_id' })
  @ApiProperty({
    description: '스트리머 사용자',
    type: () => UserEntity,
  })
  user: UserEntity;

  @ManyToOne(() => BookEntity, (book) => book.widgetPlaylists)
  @JoinColumn({ name: 'book_id' })
  @ApiProperty({
    description: '노래책',
    type: () => BookEntity,
  })
  book: BookEntity;
}
