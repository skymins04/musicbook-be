import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MusicSourceOriginalEntity } from './music-source-original.entity';
import { MusicSourceMelonEntity } from './music-source-melon.entity';
import { DeepPartial, Repository } from 'typeorm';

@Injectable()
export class MusicBookSourceRepositoryService {
  constructor(
    @InjectRepository(MusicSourceOriginalEntity)
    private readonly musicSourceOriginRepository: Repository<MusicSourceOriginalEntity>,
    @InjectRepository(MusicSourceMelonEntity)
    private readonly musicSourceMelonRepository: Repository<MusicSourceMelonEntity>,
  ) {}

  createMusicSourceOriginal(_source: DeepPartial<MusicSourceOriginalEntity>) {
    return this.musicSourceOriginRepository.save(_source);
  }

  createMusicSourceMelon(_source: DeepPartial<MusicSourceMelonEntity>) {
    return this.musicSourceMelonRepository.save(_source);
  }

  findOneSourceOrigialById(
    _sourceId: string,
    _options?: { withDeleted?: boolean; withJoin?: boolean },
  ) {
    return this.musicSourceOriginRepository.findOne({
      where: { songId: _sourceId },
      withDeleted: _options?.withDeleted,
    });
  }

  findOneSourceMelonById(
    _sourceId: number,
    _options?: { withDeleted?: boolean; withJoin?: boolean },
  ) {
    return this.musicSourceMelonRepository.findOne({
      where: { songId: _sourceId },
      withDeleted: _options?.withDeleted,
    });
  }
}
