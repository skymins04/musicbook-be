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
  id: number;
  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.songRequestBlacklist)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => BookEntity, (book) => book.songRequestBlacklist)
  @JoinColumn({ name: 'book_id' })
  book: BookEntity;
}
