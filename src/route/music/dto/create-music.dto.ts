import { IsEnum } from 'class-validator';
import {
  EMusicMRType,
  EMusicPreviewType,
  EMusicSourceType,
} from 'src/common/repository/musicbook/music.entity';

export class CreateMusicDTO {
  @IsEnum(EMusicSourceType)
  type: keyof typeof EMusicSourceType;
  sourceId: string;
  title?: string;
  description?: string;
  previewURL?: string;
  previewType?: keyof typeof EMusicPreviewType;
  mrURL?: string;
  mrType?: keyof typeof EMusicMRType;
}
