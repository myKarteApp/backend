import { AuthRole } from '@/shared';
import { ApiProperty } from '@nestjs/swagger';

export class _DefaultAuthDto {
  @ApiProperty({
    description: 'test',
    example: 'test@test.com',
  })
  email: string;
  @ApiProperty({
    description: 'password',
    example: 'Abc123456!',
  })
  password: string;

  @ApiProperty({
    description: '認可ロール: [1,2,3,4,5,6]',
    example: AuthRole.client,
  })
  authRole?: AuthRole;
}
