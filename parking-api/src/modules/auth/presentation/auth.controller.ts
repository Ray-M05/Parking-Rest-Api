import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RegisterUseCase } from '../application/use-cases/register.use-case';
import { LoginUseCase } from '../application/use-cases/login.use-case';
import { RegisterRequestDto } from './dtos/register-request.dto';
import { LoginRequestDto } from './dtos/login-request.dto';
import {
  LoginResponseDto,
  RegisteredUserResponseDto,
} from './dtos/auth-response.dto';
import { Public } from './decorators/public.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
  ) {}

  @Public()
  @ApiCreatedResponse({ type: RegisteredUserResponseDto })
  @Post('register')
  register(
    @Body() dto: RegisterRequestDto,
  ): Promise<RegisteredUserResponseDto> {
    return this.registerUseCase.execute(dto);
  }

  @Public()
  @ApiOkResponse({ type: LoginResponseDto })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginRequestDto): Promise<LoginResponseDto> {
    return this.loginUseCase.execute(dto);
  }
}
