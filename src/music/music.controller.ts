import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('music')
@ApiTags('Music')
export class MusicController {}
