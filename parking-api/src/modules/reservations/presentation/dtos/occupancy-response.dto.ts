import { ApiProperty } from '@nestjs/swagger';

export class OccupancyResponseDto {
  @ApiProperty({ example: 7 })
  total!: number;

  @ApiProperty({ example: 3 })
  occupied!: number;

  @ApiProperty({ example: 4 })
  available!: number;

  @ApiProperty({ example: 0.43 })
  occupancyRate!: number;

  @ApiProperty({ example: '2026-08-01T10:00:00.000Z' })
  generatedAt!: string;
}
