import {
  BaseEntity,
  Column,
  DeepPartial,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { BookEntity } from '../musicbook/book.entity';

@Entity('widget-playlist')
export class WidgetPlaylistEntity extends BaseEntity {
  constructor(_widget?: DeepPartial<WidgetPlaylistEntity>) {
    super();
    if (_widget)
      for (const key of Object.keys(_widget)) this[key] = _widget[key];
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: '새 플레이리스트 위젯' })
  title: string;

  @Column({
    default: `${process.env.CLOUDFLARE_R2_CDN_ADDRESS}/basic_theme.css`,
  })
  themeURL: string;

  @Column('integer', { default: 24 })
  fontSize: number;

  @ManyToOne(() => UserEntity, (user) => user.widgetPlaylists)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => BookEntity, (book) => book.widgetPlaylists)
  @JoinColumn({ name: 'book_id' })
  book: BookEntity;
}
