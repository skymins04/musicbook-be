import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MusicEntity } from './music.entity';

@Entity('music-source-original')
export class MusicSourceOriginalEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: '노래책 고유 음원 ID (uuidv4)',
    type: String,
    example: '12341234-1234-1234-123412341234',
  })
  songId: string;
  @Column()
  @ApiProperty({
    description: '노래책 고유 원곡 음원 제목',
    type: String,
    example: '음원 제목',
  })
  songTitle: string;
  @Column()
  @ApiProperty({
    description: '노래책 고유 원곡 음원 가수명',
    type: String,
    example: '앨범 가수명',
  })
  artistName: string;
  @Column({ nullable: true })
  @ApiProperty({
    description: '노래책 고유 원곡 음원 가수 프로필이미지',
    type: String,
    nullable: true,
    example: 'https://example.com/thumbnail.jpg',
  })
  artistThumbmail: string;
  @Column()
  @ApiProperty({
    description: '노래책 고유 음원 장르',
    type: String,
    example: 'J-POP',
  })
  category: string;
  @Column({ nullable: true })
  @ApiProperty({
    description: '노래책 고유 앨범 제목',
    type: String,
    nullable: true,
    example: '앨범 제목',
  })
  albumTitle: string;
  @Column({ nullable: true })
  @ApiProperty({
    description: '노래책 고유 앨범 자켓이미지',
    type: String,
    nullable: true,
    example: 'https://example.com/thumbnail.jpg',
  })
  albumThumbnail: string;
  @Column('text', { nullable: true })
  @ApiProperty({
    description: '노래책 고유 음원 가사',
    type: String,
    nullable: true,
    example: '대충 가사 텍스트.',
  })
  lyrics: string;
  @CreateDateColumn()
  @ApiProperty({
    description:
      '노래책 고유 음원 등록 생성타임스템프(ISO8601, YYYY-MM-DDTHH:mm:ss.sssZ)',
    type: String,
    example: '2023-02-27T13:02:00.650Z',
  })
  createdAt: Date;
  @UpdateDateColumn()
  @ApiProperty({
    description:
      '노래책 고유 음원 등록 수정타임스템프(ISO8601, YYYY-MM-DDTHH:mm:ss.sssZ)',
    type: String,
    example: '2023-02-27T13:02:00.650Z',
  })
  updatedAt: Date;
  @DeleteDateColumn()
  @ApiProperty({
    description:
      '노래책 고유 음원 등록 삭제타임스템프(ISO8601, YYYY-MM-DDTHH:mm:ss.sssZ)',
    type: String,
    nullable: true,
    example: '2023-02-27T13:02:00.650Z',
  })
  deletedAt: Date;

  @OneToMany(() => MusicEntity, (music) => music.musicSourceOriginal)
  musics: MusicEntity[];
}
