import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MusicEntity } from 'src/common/repository/musicbook/music.entity';
import { MusicBookLikeRepository } from 'src/common/repository/musicbook/musicbook-like.repository';
import { MusicBookRepository } from 'src/common/repository/musicbook/musicbook.repository';
import { MelonService } from '../melon/melon.service';
import { MusicBookSourceRepository } from 'src/common/repository/musicbook/musicbook-source.repository';
import { CreateOriginalSourceDTO } from './dto/create-music-source.dto';
import { CloudflareImagesService } from 'src/common/cloudflare/cloudflare-images.service';
import { GetURLsForMusicSourceImgDirectUploadingResponseDataDTO } from './dto/get-direct-upload-url';
import { EMusicbookSortMethod } from 'src/common/repository/musicbook/enum';

@Injectable()
export class MusicService {
  constructor(
    private readonly musicbookRepository: MusicBookRepository,
    private readonly musicbookLikeRepository: MusicBookLikeRepository,
    private readonly musicbookSourceRepository: MusicBookSourceRepository,
    private readonly melonService: MelonService,
    private readonly cloudflareImagesService: CloudflareImagesService,
  ) {}

  private getMusicsSortHandler: Record<
    keyof typeof EMusicbookSortMethod,
    (_perPage: number, _page: number) => Promise<MusicEntity[]>
  > = {
    NEWEST: (_perPage, _page) => {
      return this.musicbookRepository.findManyNewestMusic(_perPage, _page);
    },
    SUGGEST: (_perPage, _page) => {
      return this.musicbookRepository.findManySuggestMusic(_perPage, _page);
    },
    POPULAR: (_perPage, _page) => {
      return this.musicbookRepository.findManyPopularMusic(_perPage, _page);
    },
  };

  getMusics(
    _perPage: number,
    _page: number,
    _sort: keyof typeof EMusicbookSortMethod,
  ) {
    return this.getMusicsSortHandler[_sort](_perPage, _page);
  }

  createMusic(_jwt: MusicbookJwtPayload) {
    // this.musicbookRepository.createMusic;
  }

  async getURLsForMusicImgDirectUploading(
    _jwt: MusicbookJwtPayload,
    _ip: string,
  ): Promise<GetURLsForMusicSourceImgDirectUploadingResponseDataDTO> {
    const [artistThumbnail, albumThumbnail] = await Promise.all([
      this.cloudflareImagesService.getDirectUploadURL({
        meta: {
          type: 'music_source_artistThumbnail',
          uploader: _jwt.id,
          ip: _ip,
          timestamp: new Date().toISOString(),
        },
      }),
      this.cloudflareImagesService.getDirectUploadURL({
        meta: {
          type: 'music_source_albumThumbnail',
          uploader: _jwt.id,
          ip: _ip,
          timestamp: new Date().toISOString(),
        },
      }),
    ]);

    return {
      artistThumbnail,
      albumThumbnail,
    };
  }

  async createOriginalSource(_source: CreateOriginalSourceDTO) {
    const imgIds: string[] = [];
    if (_source.albumThumbnail) imgIds.push(_source.albumThumbnail);
    if (_source.artistThumbnail) imgIds.push(_source.artistThumbnail);

    for (const id of imgIds) {
      try {
        const { result } = await this.cloudflareImagesService.getImageInfo(id);
        if (result.draft) throw new BadRequestException('invaild image');
      } catch (err) {
        throw new BadRequestException('invaild image');
      }
    }

    const albumThumbnailURL = _source.albumThumbnail
      ? `https://cdnimg.musicbook.kr/${_source.albumThumbnail}/public`
      : undefined;
    const artistThumbnailURL = _source.artistThumbnail
      ? `https://cdnimg.musicbook.kr/${_source.artistThumbnail}/public`
      : undefined;

    await this.musicbookSourceRepository.createMusicSourceOriginal({
      songTitle: _source.title,
      artistName: _source.artistName,
      artistThumbnail: artistThumbnailURL,
      category: _source.category,
      albumTitle: _source.albumTitle,
      albumThumbnail: albumThumbnailURL,
      lyrics: _source.lyrics,
    });
  }

  async createMelonSource(_melonSongId: number) {
    await this.melonService.getMelonSongInfo(_melonSongId);
  }

  getMyMusics(_jwt: MusicbookJwtPayload) {
    return this.musicbookRepository.findManyMusicByUserId(_jwt.id);
  }

  async getMusic(_musicId: string) {
    const music = await this.musicbookRepository.findOneMusicById(_musicId);
    if (!music) throw new NotFoundException();
    return music;
  }

  updateMusic() {}
  deleteMusic() {}

  async getLikeCountOfMusic(_musicId: string) {
    const music = await this.musicbookRepository.findOneBookById(_musicId);
    if (!music) throw new BadRequestException();
    return music.likeCount;
  }

  async createLikeOfMusic(_jwt: MusicbookJwtPayload, _musicId: string) {
    await this.musicbookLikeRepository.createMusicLike(_jwt.id, _musicId);
  }

  async deleteLikeOfMusic(_jwt: MusicbookJwtPayload, _musicId: string) {
    await this.musicbookLikeRepository.deleteMusicLike(_jwt.id, _musicId);
  }

  async getMyLikeOfMusic(_jwt: MusicbookJwtPayload, _musicId: string) {
    if (!(await this.musicbookRepository.existMusicById(_musicId)))
      throw new BadRequestException();
    return this.musicbookLikeRepository.existMusicLike(_jwt.id, _musicId);
  }
}
