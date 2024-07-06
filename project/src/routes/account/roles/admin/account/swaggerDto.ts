import { AuthRole, AuthType, SexType } from '@/shared';
import { ApiProperty } from '@nestjs/swagger';

class CreateUserInfo {
  @ApiProperty({
    example: new Date(),
  })
  birthDay: Date;
  @ApiProperty({
    example: SexType.male,
  })
  sex: SexType;
  @ApiProperty({
    example: 'male',
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

export class _CreateAccountInfoDto {
  // AuthInfo
  @ApiProperty({
    example: 'test@test.com',
  })
  email: string;
  @ApiProperty({
    example: 'Abc1234!',
  })
  password: string;
  @ApiProperty({
    example: AuthType.default,
  })
  authType: AuthType;
  @ApiProperty({
    description: '1, 2, 3, 4, 5, 6',
    example: AuthRole.client,
  })
  authRole: AuthRole;
  @ApiProperty({
    example: 'true',
  })
  isVerify: boolean;
  @ApiProperty({
    example: 'false',
  })
  isTrial: boolean;

  @ApiProperty({
    type: () => CreateUserInfo, // UserInfo クラスを指定して階層化する
  })
  user: CreateUserInfo;
}

class UpdateUserInfo {
  @ApiProperty({
    example: new Date(),
  })
  birthDay?: Date;
  @ApiProperty({
    example: SexType.male,
  })
  sex?: SexType;
  @ApiProperty({
    example: 'male',
  })
  gender?: string;
  @ApiProperty({
    example: '田中',
  })
  familyName?: string;
  @ApiProperty({
    example: '太朗',
  })
  givenName?: string;
  // TODO: addressオブジェクトを考える
  @ApiProperty({
    example: '大阪府',
  })
  address?: string;
  @ApiProperty({
    example: '080-0000-0000',
  })
  tel?: string;
  @ApiProperty({
    example: '会社員',
  })
  profession?: string;
}

export class _UpdateAccountInfoDto {
  // AuthInfo
  // AuthInfo
  @ApiProperty({
    example: 'test@test.com',
  })
  email?: string;
  @ApiProperty({
    example: 'Abc1234!',
  })
  password?: string;
  @ApiProperty({
    example: AuthType.default,
  })
  authType?: AuthType;
  @ApiProperty({
    description: '1, 2, 3, 4, 5, 6',
    example: AuthRole.client,
  })
  authRole?: AuthRole;
  @ApiProperty({
    example: 'true',
  })
  isVerify?: boolean;
  @ApiProperty({
    example: 'false',
  })
  isTrial?: boolean;

  // UserInfo
  @ApiProperty({
    type: () => CreateUserInfo, // UserInfo クラスを指定して階層化する
  })
  user?: UpdateUserInfo;
}
