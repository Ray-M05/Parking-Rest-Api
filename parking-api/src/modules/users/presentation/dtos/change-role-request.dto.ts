import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { Role } from '../../domain/enums/role.enum';

export class ChangeRoleRequestDto {
  @ApiProperty({ enum: Role, example: Role.Employee })
  @IsEnum(Role)
  role!: Role;
}
