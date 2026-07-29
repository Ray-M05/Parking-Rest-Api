import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

export class AvailableSpotsQueryDto {
  @ApiProperty({ example: '2026-08-01T10:00:00.000Z' })
  @IsDateString()
  start!: string;

  @ApiProperty({ example: '2026-08-01T12:00:00.000Z' })
  @IsDateString()
  end!: string;
}
