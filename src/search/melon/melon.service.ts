import { InjectRedis } from '@nestjs-modules/ioredis';
import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { Redis } from 'ioredis';
import {
  ApiResponseDataDTO,
  ApiResponsePagenationDataDTO,
} from 'src/common/api-response/api-response-data.dto';
import {
  SearchSongMelonSortEnum,
  SearchSongMelonSectionEnum,
} from './dto/search-song-melon.dto';

@Injectable()
export class MelonService {
  constructor(@InjectRedis() private readonly redisCache: Redis) {}

  async searchSongByMelon(
    _section: keyof typeof SearchSongMelonSectionEnum,
    _q: string,
    _page: number,
    _sort: keyof typeof SearchSongMelonSortEnum,
  ) {
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
          $('tbody > tr > td:nth-of-type(1) input').map(
            (i, el) => 'melon_song_' + $(el).attr('value').trim(),
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
              id: 'melon_album_' + albumId,
            };
          }),
        );

        return new ApiResponsePagenationDataDTO<{
          sort: keyof typeof SearchSongMelonSortEnum;
        }>(
          {
            perPage: 50,
            currentPage: _page,
            sort: _sort,
            pageItemCount: songTitles.length,
          },
          songTitles.map((itm, idx) => ({
            id: songIds[idx],
            songTitle: itm,
            artist: artists[idx],
            album: albums[idx],
          })),
        );
      });
  }

  async getMelonAlbumInfo(_albumId: string) {
    const albumId = _albumId.replace(/melon_album_/g, '');
    return await axios
      .get(`https://www.melon.com/album/detail.htm?albumId=${albumId}`)
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

        return new ApiResponseDataDTO({
          albumId: 'melon_album_' + _albumId,
          albumTitle,
          artistName,
          artistThumbnail,
          thumbnail: {
            '1000': `${thumbnailBaseURL}_1000.jpg`,
            '500': `${thumbnailBaseURL}_500.jpg`,
            '200': `${thumbnailBaseURL}.jpg`,
          },
        });
      });
  }
}
