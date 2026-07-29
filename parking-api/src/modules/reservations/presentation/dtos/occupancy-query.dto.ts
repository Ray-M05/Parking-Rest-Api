import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class OccupancyQueryDto {
  @ApiPropertyOptional({
    example: '2026-08-01T10:00:00.000Z',
    description: 'Instante a consultar; si se omite, usa el momento actual.',
  })
  @IsOptional()
  @IsDateString()
  at?: string;
}
