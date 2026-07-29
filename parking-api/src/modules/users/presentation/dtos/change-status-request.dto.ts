import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class ChangeStatusRequestDto {
  @ApiProperty({
    example: true,
    description: 'true reactiva, false desactiva.',
  })
  @IsBoolean()
  active!: boolean;
}
