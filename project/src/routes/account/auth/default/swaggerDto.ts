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
}
