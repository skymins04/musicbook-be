import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { MelonModule } from './melon/melon.module';

@Module({
  controllers: [SearchController],
  providers: [SearchService],
  imports: [MelonModule],
})
export class SearchModule {}
