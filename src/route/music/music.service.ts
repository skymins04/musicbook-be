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
import {
  EMusicMRType,
  EMusicPreviewType,
  EMusicSourceType,
  EMusicbookSortMethod,
} from 'src/common/repository/musicbook/musicbook.enum';
import { CreateMusicDTO } from './dto/create-music.dto';
import { BookEntity } from 'src/common/repository/musicbook/book.entity';
import { UpdateMyMusicDTO } from './dto/update-my-music.dto';
import { RedisService } from 'src/common/redis/redis.service';
import {
  MusicConfigDTO,
  MusicConfigReponseDataDTO,
} from './dto/music-config.dto';

@Injectable()
export class MusicService {
  constructor(
    private readonly musicbookRepository: MusicBookRepository,
    private readonly musicbookLikeRepository: MusicBookLikeRepository,
    private readonly musicbookSourceRepository: MusicBookSourceRepository,
    private readonly melonService: MelonService,
    private readonly cloudflareImagesService: CloudflareImagesService,
    private readonly redisService: RedisService,
  ) {}

  private getMusicsSortHandler: Record<
    keyof typeof EMusicbookSortMethod,
    (
      _perPage: number,
      _page: number,
      _options?: {
        q?: string;
        category?: string;
        userId?: string;
        bookId?: string;
      },
    ) => Promise<MusicEntity[]>
  > = {
    NEWEST: (_perPage, _page, _options) => {
      return this.musicbookRepository.findManyNewestMusic(_perPage, _page, {
        q: _options?.q,
        category: _options?.category,
        userId: _options?.userId,
        bookId: _options?.bookId,
      });
    },
    SUGGEST: (_perPage, _page, _options) => {
      return this.musicbookRepository.findManySuggestMusic(_perPage, _page, {
        q: _options?.q,
        category: _options?.category,
        userId: _options?.userId,
        bookId: _options?.bookId,
      });
    },
    POPULAR: (_perPage, _page, _options) => {
      return this.musicbookRepository.findManyPopularMusic(_perPage, _page, {
        q: _options?.q,
        category: _options?.category,
        userId: _options?.userId,
        bookId: _options?.bookId,
      });
    },
  };

  getMusics(
    _perPage: number,
    _page: number,
    _sort: keyof typeof EMusicbookSortMethod,
    _options?: {
      q?: string;
      category?: string;
      userId?: string;
      bookId?: string;
    },
  ) {
    return this.getMusicsSortHandler[_sort](_perPage, _page, {
      q: _options?.q,
      category: _options?.category,
      userId: _options?.userId,
      bookId: _options?.bookId,
    });
  }

  private createMusicTypeHandler: Record<
    keyof typeof EMusicSourceType,
    (
      _userId: string,
      _book: BookEntity,
      _music: CreateMusicDTO,
    ) => Promise<MusicEntity>
  > = {
    MELON: (_userId, _book, _music) => {
      return this.musicbookRepository.createMusicByMelonSource({
        broadcaster: {
          id: _userId,
        },
        book: _book,
        musicSourceMelon: {
          songId: _music.sourceMelonId,
        },
        title: _music.title,
        description: _music.description,
        previewURL: _music.previewURL,
        previewType: _music.previewType,
        mrURL: _music.mrURL,
        mrType: _music.mrType,
      });
    },
    ORIGINAL: (_userId, _book, _music) => {
      return this.musicbookRepository.createMusicByOriginalSource({
        broadcaster: {
          id: _userId,
        },
        book: _book,
        musicSourceOriginal: {
          songId: _music.sourceOriginalId,
        },
        title: _music.title,
        description: _music.description,
        previewURL: _music.previewURL,
        previewType: _music.previewType,
        mrURL: _music.mrURL,
        mrType: _music.mrType,
      });
    },
  };

  private validateURLTypeHandler: Record<
    keyof typeof EMusicPreviewType | keyof typeof EMusicMRType,
    (_url: string) => [boolean, string | null]
  > = {
    YOUTUBE: (_url) => {
      const match = !!_url.match(
        /(http:|https:)?(\/\/)?(www\.)?(youtube.com|youtu.be)\/(watch|embed)?(\?v=|\/)?(\S+)?/g,
      );
      const id = match
        ? _url.match(
            /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/,
          )[7]
        : null;
      return [match, id];
    },
  };

  async createMusic(_jwt: MusicbookJwtPayload, _music: CreateMusicDTO) {
    const book = await this.musicbookRepository.findOneBookByUserId(_jwt.id);
    if (!book) throw new BadRequestException();

    if (_music.mrURL && _music.mrType) {
      const [result, id] = this.validateURLTypeHandler[_music.mrType](
        _music.mrURL,
      );
      if (result) _music.mrURL = id;
      else throw new BadRequestException();
    } else if (_music.mrURL && !_music.mrType) throw new BadRequestException();

    if (_music.previewURL && _music.previewType) {
      const [result, id] = this.validateURLTypeHandler[_music.previewType](
        _music.previewURL,
      );
      if (result) _music.previewURL = id;
      else throw new BadRequestException();
    } else if (_music.previewURL && !_music.previewType)
      throw new BadRequestException();

    return this.createMusicTypeHandler[_music.type](_jwt.id, book, _music);
  }

  async getURLsForMusicSourceImgDirectUploading(
    _jwt: MusicbookJwtPayload,
    _ip: string,
  ): Promise<GetURLsForMusicSourceImgDirectUploadingResponseDataDTO> {
    await this.redisService.checkRequestCooltime(
      `cooltime:music_source_img_upload_url:${_jwt.id}`,
      3,
      60,
    );

    const [artistThumbnail, albumThumbnail] = await Promise.all([
      this.cloudflareImagesService.getDirectUploadURLWithMetadata(
        'music_source_artistThumbnail',
        _jwt.id,
        _ip,
      ),
      this.cloudflareImagesService.getDirectUploadURLWithMetadata(
        'music_source_albumThumbnail',
        _jwt.id,
        _ip,
      ),
    ]);

    return {
      artistThumbnail,
      albumThumbnail,
    };
  }

  async createOriginalSource(
    _jwt: MusicbookJwtPayload,
    _source: CreateOriginalSourceDTO,
  ) {
    const imgs: { id: string; type: string }[] = [];
    if (_source.albumThumbnail)
      imgs.push({
        id: _source.albumThumbnail,
        type: 'music_source_albumThumbnail',
      });
    if (_source.artistThumbnail)
      imgs.push({
        id: _source.artistThumbnail,
        type: 'music_source_artistThumbnail',
      });

    for (const img of imgs) {
      await this.cloudflareImagesService.validateImage(
        img.id,
        _jwt.id,
        img.type,
      );
    }

    const albumThumbnailURL = _source.albumThumbnail
      ? `${process.env.CLOUDFLARE_IMAGES_CDN_ADDRESS}/${_source.albumThumbnail}/public`
      : undefined;
    const artistThumbnailURL = _source.artistThumbnail
      ? `${process.env.CLOUDFLARE_IMAGES_CDN_ADDRESS}/${_source.artistThumbnail}/public`
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

  async getMusic(_musicId: string) {
    const music = await this.musicbookRepository.findOneMusicById(_musicId);
    if (!music) throw new NotFoundException();
    return music;
  }

  async updateMyMusic(
    _jwt: MusicbookJwtPayload,
    _musicId: string,
    _music: UpdateMyMusicDTO,
  ) {
    if (_music.mrURL && _music.mrType) {
      const [result, id] = this.validateURLTypeHandler[_music.mrType](
        _music.mrURL,
      );
      if (result) _music.mrURL = id;
      else throw new BadRequestException();
    } else if (_music.mrURL && !_music.mrType) throw new BadRequestException();

    if (_music.previewURL && _music.previewType) {
      const [result, id] = this.validateURLTypeHandler[_music.previewType](
        _music.previewURL,
      );
      if (result) _music.previewURL = id;
      else throw new BadRequestException();
    } else if (_music.previewURL && !_music.previewType)
      throw new BadRequestException();

    await this.musicbookRepository.updateMusic(
      { id: _musicId, broadcaster: { id: _jwt.id } },
      _music,
    );
  }

  async deleteMusic(_jwt: MusicbookJwtPayload, _musicId: string) {
    await this.musicbookRepository.deleteMusic(_jwt.id, _musicId);
  }

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

  async getConfigMyMusic(
    _jwt: MusicbookJwtPayload,
    _musicId: string,
  ): Promise<MusicConfigReponseDataDTO> {
    const music = await this.musicbookRepository.findOneMusicByUserId(
      _jwt.id,
      _musicId,
    );
    if (!music) throw new BadRequestException();

    return {
      isHide: music.isHide,
      isPaid: music.isPaid,
      isAllowRequest: music.isAllowRequest,
    };
  }

  async setConfigMyMusic(
    _jwt: MusicbookJwtPayload,
    _musicId: string,
    _config: MusicConfigDTO,
  ): Promise<MusicConfigReponseDataDTO> {
    const music = await this.musicbookRepository.findOneMusicByUserId(
      _jwt.id,
      _musicId,
    );
    if (!music) throw new BadRequestException();
    for (const key of Object.keys(_config)) {
      music[key] = _config[key];
    }
    await music.save();

    return {
      isHide: music.isHide,
      isPaid: music.isPaid,
      isAllowRequest: music.isAllowRequest,
    };
  }
}
