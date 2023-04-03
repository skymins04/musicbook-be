import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  Max,
  ValidateIf,
} from 'class-validator';
import { ApiResponseDataDTO } from 'src/common/api-response/api-response-data.dto';
import { WidgetPlaylistEntity } from 'src/common/repository/widget-playlist/widget-playlist.entity';

export class PlaylistWidgetIdDTO {
  @IsString()
  @Matches(/^[a-z\d]{8}-[a-z\d]{4}-[a-z\d]{4}-[a-z\d]{4}-[a-z\d]{12}$/)
  @ApiProperty({
    description: '플레이리스트 위젯 ID (uuidv4)',
    type: String,
    example: '12341234-1234-1234-1234-123412341234',
  })
  widgetId: string;
}

export class PlaylistsResponseDTO implements ApiResponseDataDTO {
  @ApiProperty({
    description: '플레이리스트 위젯 목록',
    type: [WidgetPlaylistEntity],
  })
  data: WidgetPlaylistEntity[];
}

export class PlaylistResponseDTO implements ApiResponseDataDTO {
  @ApiProperty({
    description: '플레이리스트 위젯',
    type: WidgetPlaylistEntity,
  })
  data: WidgetPlaylistEntity;
}

enum EPlaylistTheme {
  BASIC = 'BASIC',
  CUSTOM = 'CUSTOM',
}

export class PlaylistUpdateDTO {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: '플레이리스트 위젯 제목',
    type: String,
    nullable: true,
    required: false,
    example: '플레이리스트 제목',
  })
  title?: string;

  @IsEnum(EPlaylistTheme)
  @IsOptional()
  @ApiProperty({
    description: '플레이리스트 위젯 테마',
    enum: EPlaylistTheme,
    nullable: true,
    required: false,
    example: 'BASIC',
  })
  theme?: keyof typeof EPlaylistTheme;

  @IsString()
  @ValidateIf((o: PlaylistUpdateDTO) => o.theme === 'CUSTOM')
  @ApiProperty({
    description: '플레이리스트 위젯 커스텀 CSS',
    type: String,
    nullable: true,
    required: false,
    example: 'h1 { color: red; }',
  })
  customCSS?: string;

  @Type(() => Number)
  @IsPositive()
  @Max(100)
  @IsOptional()
  @ApiProperty({
    description: '플레이리스트 위젯 폰트 사이즈',
    type: Number,
    nullable: true,
    required: false,
    example: 24,
  })
  fontSize?: number;
}
