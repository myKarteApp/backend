import { ApiProperty } from '@nestjs/swagger';

export class _RegisterDto {
  @ApiProperty({
    description: 'test',
    example: 'test@test.com',
  })
  email: string;

  @ApiProperty({
    description: 'password',
    example: 'asdads',
  })
  password: string;

  @ApiProperty({
    description: 'ワンタイム認証コード: 数値6文字です',
    example: '012345',
  })
  passCode: string;

  @ApiProperty({
    description: 'ワンタイムパスの検索用: ランダムな文字',
    example: 'acaac33rsdxdf',
  })
  queryToken: string;
}
