import { MusicBookRepository } from './musicbook.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { MusicEntity } from './music.entity';
import {
  BookEntity,
  BookEntityFixture,
  loadBookEntityFixture,
} from './book.entity';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import {
  UserEntity,
  UserEntityFixture,
  loadUserEntityFixture,
} from '../user/user.entity';
import { UserTwitchEntity } from '../user/user-twitch.entity';
import { UserGoogleEntity } from '../user/user-google.entity';
import { MusicSourceOriginalEntity } from './music-source-original.entity';
import {
  MusicSourceMelonEntity,
  MusicSourceMelonEntityFixture,
  loadMusicSourceMelonEntityFixture,
} from './music-source-melon.entity';
import { MusicLikeEntity } from './music-like.entity';
import { BookLikeEntity } from './book-like.entity';
import { MusicLikeCountEntity } from './music-like-count.entity';
import { BookLikeCountEntity } from './book-like-count.entity';
import { MusicBookSourceRepository } from './musicbook-source.repository';

dotenv.config();

describe('musicbook.repository.ts', () => {
  let musicbookRepository: MusicBookRepository;
  let userRepository: Repository<UserEntity>;
  let musicRepository: Repository<MusicEntity>;
  let bookRepository: Repository<BookEntity>;
  let musicSourceMelonRespository: Repository<MusicSourceMelonEntity>;
  let musicSourceOriginalRespository: Repository<MusicSourceOriginalEntity>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: process.env.MYSQL_HOST,
          port: process.env.MYSQL_PORT,
          username: process.env.MYSQL_USERNAME,
          password: process.env.MYSQL_PASSWORD,
          database: process.env.MYSQL_DATABASE + '_test',
          entities: [
            UserEntity,
            UserTwitchEntity,
            UserGoogleEntity,
            MusicEntity,
            MusicSourceOriginalEntity,
            MusicSourceMelonEntity,
            BookEntity,
            MusicLikeEntity,
            BookLikeEntity,
            MusicLikeCountEntity,
            BookLikeCountEntity,
          ],
          synchronize: false,
          keepConnectionAlive: true,
          namingStrategy: new SnakeNamingStrategy(),
        }),
        TypeOrmModule.forFeature([
          UserEntity,
          UserTwitchEntity,
          UserGoogleEntity,
          MusicEntity,
          MusicSourceOriginalEntity,
          MusicSourceMelonEntity,
          BookEntity,
          MusicLikeEntity,
          BookLikeEntity,
          MusicLikeCountEntity,
          BookLikeCountEntity,
        ]),
      ],
      providers: [MusicBookRepository, MusicBookSourceRepository],
    }).compile();

    musicbookRepository = module.get<MusicBookRepository>(MusicBookRepository);
    userRepository = module.get(getRepositoryToken(UserEntity));
    musicRepository = module.get(getRepositoryToken(MusicEntity));
    bookRepository = module.get(getRepositoryToken(BookEntity));
    musicSourceMelonRespository = module.get(
      getRepositoryToken(MusicSourceMelonEntity),
    );
    musicSourceOriginalRespository = module.get(
      getRepositoryToken(MusicSourceOriginalEntity),
    );
  });

  describe('createMusicByMelonSource()', () => {
    beforeAll(async () => {
      await loadUserEntityFixture();
      await loadBookEntityFixture();
      await loadMusicSourceMelonEntityFixture();
    });

    afterAll(async () => {
      await bookRepository.createQueryBuilder().delete().execute();
      await musicRepository.createQueryBuilder().delete().execute();
      await musicSourceMelonRespository.createQueryBuilder().delete().execute();
      await musicSourceOriginalRespository
        .createQueryBuilder()
        .delete()
        .execute();
    });

    it('멜론음원소스를 통해 수록곡을 생성한다', async () => {
      jest
        .spyOn(musicSourceMelonRespository, 'findOne')
        .mockResolvedValue(
          new MusicSourceMelonEntity(MusicSourceMelonEntityFixture[0]),
        );

      const music = await musicbookRepository.createMusicByMelonSource({
        broadcater: { id: UserEntityFixture[0].id },
        book: { id: BookEntityFixture[0].id },
        musicSourceMelon: { songId: MusicSourceMelonEntityFixture[0].songId },
        title: '테스트 제목',
        description: '테스트 설명글',
      });
      expect(music.title).toEqual('테스트 제목');
      expect(music.description).toEqual('테스트 설명글');
      expect(music.musicSourceMelon).toBeDefined();
      expect(music.category).toEqual(MusicSourceMelonEntityFixture[0].category);
    });
    it('존재하지 않는 멜론음원소스일 경우 예외를 던진다', async () => {
      jest
        .spyOn(musicSourceMelonRespository, 'findOne')
        .mockResolvedValue(null);

      try {
        const music = await musicbookRepository.createMusicByMelonSource({
          broadcater: { id: UserEntityFixture[0].id },
          book: { id: BookEntityFixture[0].id },
          musicSourceMelon: { songId: MusicSourceMelonEntityFixture[0].songId },
          title: '테스트 제목',
          description: '테스트 설명글',
        });
        fail();
      } catch (err) {
        expect(err).toBeDefined();
      }
    });
    it('존재하지 않는 노래책일 경우 예외를 던진다', async () => {
      jest
        .spyOn(musicSourceMelonRespository, 'findOne')
        .mockResolvedValue(
          new MusicSourceMelonEntity(MusicSourceMelonEntityFixture[0]),
        );

      try {
        const music = await musicbookRepository.createMusicByMelonSource({
          broadcater: { id: UserEntityFixture[0].id },
          book: { id: 'awefawefawef' },
          musicSourceMelon: { songId: MusicSourceMelonEntityFixture[0].songId },
          title: '테스트 제목',
          description: '테스트 설명글',
        });
        fail();
      } catch (err) {
        expect(err).toBeDefined();
      }
    });
    it('존재하지 않는 사용자일 경우 예외를 던진다', async () => {
      jest
        .spyOn(musicSourceMelonRespository, 'findOne')
        .mockResolvedValue(
          new MusicSourceMelonEntity(MusicSourceMelonEntityFixture[0]),
        );

      try {
        const music = await musicbookRepository.createMusicByMelonSource({
          broadcater: { id: 'asdfasdfasdf' },
          book: { id: BookEntityFixture[0].id },
          musicSourceMelon: { songId: MusicSourceMelonEntityFixture[0].songId },
          title: '테스트 제목',
          description: '테스트 설명글',
        });
        fail();
      } catch (err) {
        expect(err).toBeDefined();
      }
    });
  });

  describe('createMusicByOriginalSource()', () => {
    // beforeAll(async () => {
    //   // await loadUserEntityFixture();
    //   // await loadBookEntityFixture();
    //   // await loadMusicSourceMelonEntityFixture();
    // });

    // afterAll(async () => {
    //   // await bookRepository.createQueryBuilder().delete().execute();
    //   // await musicRepository.createQueryBuilder().delete().execute();
    //   // await musicSourceMelonRespository.createQueryBuilder().delete().execute();
    //   // await musicSourceOriginalRespository
    //   //   .createQueryBuilder()
    //   //   .delete()
    //   //   .execute();
    // });

    it.todo('노래책고유음원소스를 통해 수록곡을 생성한다');
    it.todo('존재하지 않는 노래책고유음원소스일 경우 예외를 던진다');
    it.todo('존재하지 않는 노래책일 경우 예외를 던진다');
    it.todo('존재하지 않는 사용자일 경우 예외를 던진다');
  });
});
