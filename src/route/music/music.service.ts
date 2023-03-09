import { Injectable } from '@nestjs/common';
import { MusicEntity } from 'src/common/repository/musicbook/music.entity';
import { MusicBookRepository } from 'src/common/repository/musicbook/musicbook.repository';

@Injectable()
export class MusicService {
  constructor(private readonly musicbookRepository: MusicBookRepository) {}

  private getMusicsSortHandler: Record<
    MusicbookSortMethod,
    (_perPage: number, _page: number) => Promise<MusicEntity[]>
  > = {
    newest: (_perPage, _page) => {
      return this.musicbookRepository.findManyNewestMusic(_perPage, _page);
    },
    suggest: (_perPage, _page) => {
      return this.musicbookRepository.findManySuggestMusic(_perPage, _page);
    },
    popular: (_perPage, _page) => {
      return this.musicbookRepository.findManyPopularMusic(_perPage, _page);
    },
  };

  getMusics(_perPage: number, _page: number, _sort: MusicbookSortMethod) {
    return this.getMusicsSortHandler[_sort](_perPage, _page);
  }

  createMusicByOriginal() {}
  createMusicByMelon() {}
  getMyMusics() {}
  getMusic() {}
  updateMusic() {}
  deleteMusic() {}
  getLikeCountOfMusic() {}
  createLikeOfMusic() {}
  deleteLikeOfMusic() {}
  getMyLikeOfMusic() {}
}
