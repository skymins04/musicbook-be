import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';
import { ApiResponseDataDTO } from 'src/common/api-response/api-response-data.dto';
import { BookEntity } from 'src/common/repository/musicbook/book.entity';

export class BookIdDTO {
  @IsString()
  @Matches(
    /^[a-f\d]{8}-[a-f\d]{4}-4[a-f\d]{3}-[8|9|aA|bB][a-f\d]{3}-[a-f\d]{12}$/i,
  )
  @ApiProperty({
    description: '노래책 ID (uuidv4)',
    type: String,
    example: '12341234-1234-1234-123412341234',
  })
  id: string;
}

export class BookResponseDTO implements ApiResponseDataDTO {
  @ApiProperty({
    description: '노래책 생성 결과',
    type: BookEntity,
  })
  data: BookEntity;
}

export class BookLikeCountResponseDTO implements ApiResponseDataDTO {
  @ApiProperty({
    description: '노래책 좋아요 개수 결과',
    type: Number,
  })
  data: number;
}
