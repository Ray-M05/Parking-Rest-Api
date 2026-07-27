import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity } from './infrastructure/persistence/user.orm-entity';
import { USER_REPOSITORY } from './domain/ports/user.repository';
import { TypeOrmUserRepository } from './infrastructure/persistence/typeorm-user.repository';
import { HashingModule } from '../../shared/hashing/hashing.module';
import { UsersController } from './presentation/users.controller';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { ListUsersUseCase } from './application/use-cases/list-users.use-case';
import { GetUserUseCase } from './application/use-cases/get-user.use-case';
import { UpdateUserUseCase } from './application/use-cases/update-user.use-case';
import { ChangeUserRoleUseCase } from './application/use-cases/change-user-role.use-case';
import { DeleteUserUseCase } from './application/use-cases/delete-user.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity]), HashingModule],
  controllers: [UsersController],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: TypeOrmUserRepository,
    },
    CreateUserUseCase,
    ListUsersUseCase,
    GetUserUseCase,
    UpdateUserUseCase,
    ChangeUserRoleUseCase,
    DeleteUserUseCase,
  ],
  exports: [USER_REPOSITORY],
})
export class UsersModule {}
