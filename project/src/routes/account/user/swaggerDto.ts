import { AuthRole, AuthType, SexType } from '@/shared';
import { ApiProperty } from '@nestjs/swagger';

export class _CreateUserInfo {
  // UserInfo
  @ApiProperty({
    example: new Date(),
  })
  birthDay: Date;
  @ApiProperty({
    example: SexType.male,
  })
  sex: SexType;
  @ApiProperty({
    example: SexType.male,
  })
  gender: string;
  @ApiProperty({
    example: '田中',
  })
  familyName: string;
  @ApiProperty({
    example: '太朗',
  })
  givenName: string;
  // TODO: addressオブジェクトを考える
  @ApiProperty({
    example: '大阪府',
  })
  address: string;
  @ApiProperty({
    example: '080-0000-0000',
  })
  tel: string;
  @ApiProperty({
    example: '会社員',
  })
  profession: string;
}
