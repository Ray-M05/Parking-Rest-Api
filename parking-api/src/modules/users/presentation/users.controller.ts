import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../auth/presentation/decorators/roles.decorator';
import { CurrentUser } from '../../auth/presentation/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../auth/infrastructure/strategies/jwt.strategy';
import { Role } from '../domain/enums/role.enum';
import { CreateUserUseCase } from '../application/use-cases/create-user.use-case';
import { ListUsersUseCase } from '../application/use-cases/list-users.use-case';
import { GetUserUseCase } from '../application/use-cases/get-user.use-case';
import { UpdateUserUseCase } from '../application/use-cases/update-user.use-case';
import { ChangeUserRoleUseCase } from '../application/use-cases/change-user-role.use-case';
import { DeleteUserUseCase } from '../application/use-cases/delete-user.use-case';
import { CreateUserRequestDto } from './dtos/create-user-request.dto';
import { UpdateUserRequestDto } from './dtos/update-user-request.dto';
import { ChangeRoleRequestDto } from './dtos/change-role-request.dto';
import { ListUsersQueryDto } from './dtos/list-users-query.dto';
import {
  PaginatedUsersResponseDto,
  UserResponseDto,
} from './dtos/user-response.dto';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly listUsersUseCase: ListUsersUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly changeUserRoleUseCase: ChangeUserRoleUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  @Roles(Role.Admin)
  @Post()
  create(@Body() dto: CreateUserRequestDto): Promise<UserResponseDto> {
    return this.createUserUseCase.execute(dto);
  }

  @Roles(Role.Admin)
  @Get()
  list(@Query() query: ListUsersQueryDto): Promise<PaginatedUsersResponseDto> {
    return this.listUsersUseCase.execute(query);
  }

  @Roles(Role.Admin)
  @Get(':id')
  get(@Param('id', ParseUUIDPipe) id: string): Promise<UserResponseDto> {
    return this.getUserUseCase.execute(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserRequestDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ): Promise<UserResponseDto> {
    const isOwner = currentUser.userId === id;
    const isAdmin = (currentUser.role as Role) === Role.Admin;
    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('Solo puedes editar tu propio usuario');
    }
    return this.updateUserUseCase.execute({ id, ...dto });
  }

  @Roles(Role.Admin)
  @Patch(':id/role')
  changeRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ChangeRoleRequestDto,
  ): Promise<UserResponseDto> {
    return this.changeUserRoleUseCase.execute({ id, role: dto.role });
  }

  @Roles(Role.Admin)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.deleteUserUseCase.execute(id);
  }
}
