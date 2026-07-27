import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { Role } from '../../domain/enums/role.enum';

export class CreateUserRequestDto {
  @ApiProperty({ example: 'empleado@parking.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'secret123', minLength: 8 })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty({ enum: Role, example: Role.Employee })
  @IsEnum(Role)
  role!: Role;
}
