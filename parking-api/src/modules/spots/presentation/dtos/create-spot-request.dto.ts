import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSpotRequestDto {
  @ApiProperty({ example: 'C-01' })
  @IsString()
  @IsNotEmpty()
  code!: string;
}
