import { InjectRedis } from '@nestjs-modules/ioredis';
import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { Redis } from 'ioredis';
import {
  SearchSongMelonSortEnum,
  SearchSongMelonSectionEnum,
  SearchSongMelonResponseDataDTO,
} from './dto/search-song-melon.dto';
import { GetSongMelonResponseDataDTO } from './dto/get-song-melon.dto';
import { GetAlbumMelonResponseDataDTO } from './dto/get-album-melon.dto';
import { MusicBookSourceRepository } from 'src/common/repository/musicbook/musicbook-source.repository';
import { MusicSourceMelonEntity } from 'src/common/repository/musicbook/music-source-melon.entity';

@Injectable()
export class MelonService {
  constructor(
    @InjectRedis() private readonly redisCache: Redis,
    private readonly musicbookSourceRepositoryService: MusicBookSourceRepository,
  ) {}

  async searchSongByMelon(
    _section: keyof typeof SearchSongMelonSectionEnum,
    _q: string,
    _page: number,
    _sort: keyof typeof SearchSongMelonSortEnum,
  ): Promise<SearchSongMelonResponseDataDTO[]> {
    const encodedSearchQuery = encodeURIComponent(_q);
    const startIdx = 1 + 50 * (_page - 1);

    return await axios
      .get(
        `https://www.melon.com/search/song/index.htm?startIndex=${startIdx}&pageSize=50&q=${encodedSearchQuery}&sort=${_sort}&section=${_section}&sectionId=&genreDir=`,
      )
      .then((res) => res.data)
      .then(async (res) => {
        const $ = cheerio.load(res);
        const songIds = Array.from(
          $('tbody > tr > td:nth-of-type(1) input').map((i, el) =>
            parseInt($(el).attr('value').trim()),
          ),
        );
        const songTitles = Array.from(
          $('tbody > tr > td:nth-of-type(3) a.fc_gray').map((i, el) =>
            $(el).attr('title').trim(),
          ),
        );
        const artists = Array.from(
          $('tbody > tr > td:nth-of-type(4) span > a.fc_mgray').map((i, el) =>
            $(el).attr('title').split(' - 페이지 ')[0].trim(),
          ),
        );
        const albums = Array.from(
          $('tbody > tr > td:nth-of-type(5) a').map((i, el) => {
            const albumId = $(el)
              .attr('href')
              .match(/(?<=goAlbumDetail\(\')[0-9]+(?=\'\))/)[0];
            return {
              title: $(el).attr('title').split(' - 페이지 ')[0].trim(),
              id: parseInt(albumId),
            };
          }),
        );

        return songTitles.map((itm, idx) => ({
          songId: songIds[idx],
          songTitle: itm,
          artist: artists[idx],
          album: albums[idx],
        }));
      });
  }

  async getMelonSongInfo(
    _songId: number,
  ): Promise<GetSongMelonResponseDataDTO> {
    const source =
      await this.musicbookSourceRepositoryService.findOneSourceMelonById(
        _songId,
      );
    if (source)
      return {
        songId: _songId,
        songTitle: source.songTitle,
        albumTitle: source.albumTitle,
        artistName: source.artistName,
        category: source.category,
        releasedAt: source.releasedAt.toISOString(),
        artistThumbnail: source.artistThumbnail,
        thumbnail: {
          '1000': source.albumThumbnail1000,
          '500': source.albumThumbnail500,
          '200': source.albumThumbnail200,
        },
        lyrics: source.lyrics,
      };

    return await axios
      .get(`https://www.melon.com/song/detail.htm?songId=${_songId}`)
      .then((res) => res.data)
      .then(async (res) => {
        const $song = cheerio.load(res);
        if (
          !$song(
            '#downloadfrm > div > div > div.entry > div.info > div.song_name',
          ).length
        )
          throw new BadRequestException('not found song');
        const songTitle = $song(
          '#downloadfrm > div > div > div.entry > div.info > div.song_name',
        )
          .text()
          .trim()
          .split('\t')
          .splice(-1)[0];
        const albumTitle = $song(
          '#downloadfrm > div > div > div.entry > div.meta > dl > dd:nth-child(2) > a',
        )
          .text()
          .trim();
        const artistName = $song(
          '#downloadfrm > div > div > div.entry > div.info > div.artist > a > span:nth-child(1)',
        )
          .text()
          .trim();
        const artistThumbnail = $song(
          '#downloadfrm > div > div > div.entry > div.info > div.artist > a > span.thumb_atist > img',
        ).attr('src');

        const releasedAt = new Date(
          $song(
            '#downloadfrm > div > div > div.entry > div.meta > dl > dd:nth-child(4)',
          )
            .text()
            .trim(),
        ).toISOString();

        const category = $song(
          '#downloadfrm > div > div > div.entry > div.meta > dl > dd:nth-child(6)',
        )
          .text()
          .trim();

        const lyrics =
          $song('#d_video_summary')
            .html()
            ?.replace(/\<\!\-\-.*\-\-\>/g, '')
            .replace(/\<br ?\/?\>/g, '\n')
            .replace(/\\t/g, '')
            .trim() || '';

        const thumbnailRawURL = $song(
          '#downloadfrm > div > div > div.thumb > a > img',
        )
          .attr('src')
          .split('?')[0];
        let thumbnailBaseURL = '';
        if (thumbnailRawURL.match(/\_500\.jpg/)) {
          thumbnailBaseURL = thumbnailRawURL.split('_500.jpg')[0];
        } else if (thumbnailRawURL.match(/\_1000\.jpg/)) {
          thumbnailBaseURL = thumbnailRawURL.split('_1000.jpg')[0];
        } else {
          thumbnailBaseURL = thumbnailRawURL.split('.jpg')[0];
        }
        thumbnailBaseURL = thumbnailBaseURL.replace(
          'https://cdnimg.melon.co.kr',
          'https://cdnimg.musicbook.kr/melon',
        );

        const melonSource = new MusicSourceMelonEntity();
        melonSource.songId = _songId;
        melonSource.songTitle = songTitle;
        melonSource.albumTitle = albumTitle;
        melonSource.artistName = artistName;
        melonSource.category = category;
        melonSource.releasedAt = new Date(releasedAt);
        melonSource.artistThumbnail = artistThumbnail;
        melonSource.albumThumbnail1000 = `${thumbnailBaseURL}_1000.jpg`;
        melonSource.albumThumbnail500 = `${thumbnailBaseURL}_500.jpg`;
        melonSource.albumThumbnail200 = `${thumbnailBaseURL}.jpg`;
        melonSource.lyrics = lyrics;
        await melonSource.save();

        return {
          songId: _songId,
          songTitle,
          albumTitle,
          artistName,
          category,
          releasedAt,
          artistThumbnail,
          thumbnail: {
            '1000': `${thumbnailBaseURL}_1000.jpg`,
            '500': `${thumbnailBaseURL}_500.jpg`,
            '200': `${thumbnailBaseURL}.jpg`,
          },
          lyrics,
        };
      });
  }

  async getMelonAlbumInfo(
    _albumId: number,
  ): Promise<GetAlbumMelonResponseDataDTO> {
    return await axios
      .get(`https://www.melon.com/album/detail.htm?albumId=${_albumId}`)
      .then((res) => res.data)
      .then((res) => {
        const $album = cheerio.load(res);
        if (
          !$album(
            '#conts > div.section_info > div > div.entry > div.info > div.song_name',
          ).length
        )
          throw new BadRequestException('not found album');
        const albumTitle = $album(
          '#conts > div.section_info > div > div.entry > div.info > div.song_name',
        )
          .text()
          .trim()
          .split('\t')
          .splice(-1)[0];
        const artistName = $album(
          '#conts > div.section_info > div > div.entry > div.info > div.artist > a',
        )
          .attr('title')
          .trim();
        const artistThumbnail = $album(
          '#conts > div.section_info > div > div.entry > div.info > div.artist > a > span.thumb_atist > img',
        ).attr('src');

        const thumbnailRawURL = $album('#d_album_org > img')
          .attr('src')
          .split('?')[0];
        let thumbnailBaseURL = '';
        if (thumbnailRawURL.match(/\_500\.jpg/)) {
          thumbnailBaseURL = thumbnailRawURL.split('_500.jpg')[0];
        } else if (thumbnailRawURL.match(/\_1000\.jpg/)) {
          thumbnailBaseURL = thumbnailRawURL.split('_1000.jpg')[0];
        } else {
          thumbnailBaseURL = thumbnailRawURL.split('.jpg')[0];
        }

        return {
          albumId: _albumId,
          albumTitle,
          artistName,
          artistThumbnail,
          thumbnail: {
            '1000': `${thumbnailBaseURL}_1000.jpg`,
            '500': `${thumbnailBaseURL}_500.jpg`,
            '200': `${thumbnailBaseURL}.jpg`,
          },
        };
      });
  }
}
