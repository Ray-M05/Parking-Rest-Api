import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateVehicleRequestDto {
  @ApiProperty({ example: 'ABC123' })
  @IsString()
  plate!: string;

  @ApiPropertyOptional({
    description: 'Solo admin: crear el vehículo a nombre de otro usuario.',
  })
  @IsOptional()
  @IsUUID()
  ownerId?: string;
}
