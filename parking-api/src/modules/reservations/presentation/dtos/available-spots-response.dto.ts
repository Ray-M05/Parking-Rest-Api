import { ApiProperty } from '@nestjs/swagger';

export class AvailableSpotResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ example: 'A-01' })
  code!: string;
}
