import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeepPartial,
  DeleteDateColumn,
  Entity,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('user_google')
export class UserGoogleEntity extends BaseEntity {
  constructor(_userGoogleEntity?: DeepPartial<UserGoogleEntity>) {
    super();
    if (_userGoogleEntity)
      for (const key of Object.keys(_userGoogleEntity)) {
        this[key] = _userGoogleEntity[key];
      }
  }

  @PrimaryColumn()
  @ApiProperty({
    description: '구글 사용자 ID (numeric string)',
    type: String,
    example: '12341234',
  })
  googleId: string;
  @Column({ nullable: true })
  @ApiProperty({
    description: '구글 사용자 이름',
    type: String,
    example: '홍길동',
  })
  googleDisplayName: string;
  @Column()
  @ApiProperty({
    description: '구글 사용자 프로필 이미지',
    type: String,
    example: 'http://example.com/example.png',
  })
  googleProfileImgURL: string;
  @Column()
  @ApiProperty({
    description: '구글 사용자 이메일',
    type: String,
    example: 'example@example.com',
  })
  googleEmail: string;
  @CreateDateColumn()
  @ApiProperty({
    description:
      '구글 사용자 등록 생성타임스템프(ISO8601, YYYY-MM-DDTHH:mm:ss.sssZ)',
    type: String,
    example: '2023-02-27T13:02:00.650Z',
  })
  createdAt: Date;
  @UpdateDateColumn()
  @ApiProperty({
    description:
      '구글 사용자 등록 수정타임스템프(ISO8601, YYYY-MM-DDTHH:mm:ss.sssZ)',
    type: String,
    example: '2023-02-27T13:02:00.650Z',
  })
  updatedAt: Date;
  @DeleteDateColumn()
  @ApiProperty({
    description:
      '구글 사용자 등록 삭제타임스템프(ISO8601, YYYY-MM-DDTHH:mm:ss.sssZ)',
    type: String,
    nullable: true,
    example: '2023-02-27T13:02:00.650Z',
  })
  deletedAt: Date;

  @OneToOne(() => UserEntity, (user) => user.google, { onDelete: 'CASCADE' })
  user: UserEntity;
}
