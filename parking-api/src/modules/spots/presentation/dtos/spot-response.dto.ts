import { ApiProperty } from '@nestjs/swagger';

export class SpotResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ example: 'A-01' })
  code!: string;

  @ApiProperty()
  active!: boolean;
}

export class PaginatedSpotsResponseDto {
  @ApiProperty({ type: [SpotResponseDto] })
  data!: SpotResponseDto[];

  @ApiProperty()
  total!: number;

  @ApiProperty()
  page!: number;

  @ApiProperty()
  limit!: number;
}
