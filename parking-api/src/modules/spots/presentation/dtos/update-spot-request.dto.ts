import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateSpotRequestDto {
  @ApiPropertyOptional({ example: 'C-02' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
