import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { MusicBookLikeCountRepository } from 'src/common/repository/musicbook/musicbook-like-count.repository';
import { MusicBookRepository } from 'src/common/repository/musicbook/musicbook.repository';

@Injectable()
export class MetricCollectionCron {
  constructor(
    private readonly musicbookRepository: MusicBookRepository,
    private readonly musicbookLikeCountRepository: MusicBookLikeCountRepository,
  ) {
    this.logger.log(`${MetricCollectionCron.name} initialized.`);
  }

  private readonly logger = new Logger(MetricCollectionCron.name);

  // @Cron('0 0 7 * * *')
  async collectionMusicLikeMetric() {
    const date = new Date();
    const snapshotPoint = new Date(
      `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 00:00:00`,
    );
    const musics = await this.musicbookRepository.findAllMusic({
      withDeleted: false,
      withJoin: false,
    });
    const promises: Promise<void>[] = [];

    for (const music of musics) {
      promises.push(
        this.musicbookLikeCountRepository.createMusicLikeCountSnapshot(
          music.id,
          snapshotPoint,
        ),
      );
    }
    if (musics.length > 0) {
      this.logger.log('Start MusicLikeMetric collecting...');
      await Promise.all(promises).then(() =>
        this.logger.log('Done MusicLikeMetric collecting!'),
      );
    }
  }

  // @Cron('0 0 7 * * *')
  async collectionBookLikeMetric() {
    const date = new Date();
    const snapshotPoint = new Date(
      `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 00:00:00`,
    );
    const books = await this.musicbookRepository.findAllBook({
      withDeleted: false,
      withJoin: false,
    });
    const promises: Promise<void>[] = [];

    for (const book of books) {
      promises.push(
        this.musicbookLikeCountRepository.createBookLikeCountSnapshot(
          book.id,
          snapshotPoint,
        ),
      );
    }
    if (books.length > 0) {
      this.logger.log('Start BookLikeMetric collecting...');
      await Promise.all(promises).then(() =>
        this.logger.log('Done BookLikeMetric collecting!'),
      );
    }
  }
}
