import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateVehicleRequestDto {
  @ApiProperty({ example: 'XYZ789' })
  @IsString()
  plate!: string;
}
