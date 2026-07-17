import { ApiProperty } from '@nestjs/swagger';

export class RegisteredUserResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  role!: string;
}

export class LoginResponseDto {
  @ApiProperty()
  accessToken!: string;
}
