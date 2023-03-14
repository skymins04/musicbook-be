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
  id: number;
  @Column('boolean', { default: false })
  isPaid: boolean;
  @Column('boolean', { default: false })
  isPlayed: boolean;
  @Column('boolean', { default: false })
  isCompleted: boolean;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.songRequests)
  @JoinColumn({ name: 'viewer_id' })
  viewer: UserEntity;
  @ManyToOne(() => UserEntity, (user) => user.songRequests)
  @JoinColumn({ name: 'broadcaster_id' })
  broadcaster: UserEntity;
  @ManyToOne(() => MusicEntity, (music) => music.songRequests)
  @JoinColumn({ name: 'music_id' })
  music: MusicEntity;
  @ManyToOne(() => BookEntity, (book) => book.songRequests)
  @JoinColumn({ name: 'book_id' })
  book: BookEntity;
}
