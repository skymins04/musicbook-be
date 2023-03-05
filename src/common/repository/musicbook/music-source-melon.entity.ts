import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MusicEntity } from './music.entity';

@Entity('music-source-melon')
export class MusicSourceMelonEntity extends BaseEntity {
  @PrimaryColumn()
  @ApiProperty({
    description: 'melon 음원 ID (number)',
    type: Number,
    example: 12345678,
  })
  songId: number;
  @Column()
  @ApiProperty({
    description: 'melon 음원 제목',
    type: String,
    example: '음원 제목',
  })
  songTitle: string;
  @Column()
  @ApiProperty({
    description: 'melon 음원 가수명',
    type: String,
    example: '음원 가수명',
  })
  artistName: string;
  @Column()
  @ApiProperty({
    description: 'melon 음원 가수 프로필이미지',
    type: String,
    example: 'https://example.com/thumbnail.jpg',
  })
  artistThumbnail: string;
  @Column()
  @ApiProperty({
    description: 'melon 음원 장르',
    type: String,
    example: 'J-POP',
  })
  category: string;
  @Column()
  @ApiProperty({
    description: 'melon 앨범 제목',
    type: String,
    example: '앨범 제목',
  })
  albumTitle: string;
  @Column()
  @ApiProperty({
    description: 'melon 앨범 자켓이미지 200*200px',
    type: String,
    example: 'https://example.com/thumbnail.jpg',
  })
  albumThumbnail200: string;
  @Column()
  @ApiProperty({
    description: 'melon 앨범 자켓이미지 500*500px',
    type: String,
    example: 'https://example.com/thumbnail.jpg',
  })
  albumThumbnail500: string;
  @Column()
  @ApiProperty({
    description: 'melon 앨범 자켓이미지 1000*1000px',
    type: String,
    example: 'https://example.com/thumbnail.jpg',
  })
  albumThumbnail1000: string;
  @Column('text')
  @ApiProperty({
    description: 'melon 음원 가사',
    type: String,
    example: '대충 가사 텍스트.',
  })
  lyrics: string;
  @Column('datetime')
  @ApiProperty({
    description: 'melon 음원 발매일 (ISO8601, YYYY-MM-DDTHH:mm:ss.sssZ)',
    type: String,
    example: '2023-02-27T13:02:00.650Z',
  })
  releasedAt: Date;
  @CreateDateColumn()
  @ApiProperty({
    description:
      'melon 음원 등록 생성타임스템프(ISO8601, YYYY-MM-DDTHH:mm:ss.sssZ)',
    type: String,
    example: '2023-02-27T13:02:00.650Z',
  })
  createdAt: Date;
  @UpdateDateColumn()
  @ApiProperty({
    description:
      'melon 음원 등록 수정타임스템프(ISO8601, YYYY-MM-DDTHH:mm:ss.sssZ)',
    type: String,
    example: '2023-02-27T13:02:00.650Z',
  })
  updatedAt: Date;
  @DeleteDateColumn()
  @ApiProperty({
    description:
      'melon 음원 등록 삭제타임스템프(ISO8601, YYYY-MM-DDTHH:mm:ss.sssZ)',
    type: String,
    nullable: true,
    example: '2023-02-27T13:02:00.650Z',
  })
  deletedAt: Date;

  @OneToMany(() => MusicEntity, (music) => music.musicSourceMelon)
  musics: MusicEntity[];
}
