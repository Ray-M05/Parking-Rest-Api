import { Inject, Injectable } from '@nestjs/common';
import {
  USER_REPOSITORY,
  type UserRepository,
} from '../../domain/ports/user.repository';
import { UserId } from '../../domain/value-objects/user-id.vo';
import { Role } from '../../domain/enums/role.enum';
import { UserNotFoundError } from '../../domain/errors/user-not-found.error';

export interface ChangeUserRoleInput {
  id: string;
  role: Role;
}

export interface ChangeUserRoleOutput {
  id: string;
  email: string;
  role: string;
  active: boolean;
}

@Injectable()
export class ChangeUserRoleUseCase {
  constructor(@Inject(USER_REPOSITORY) private readonly users: UserRepository) {}

  async execute(input: ChangeUserRoleInput): Promise<ChangeUserRoleOutput> {
    const userId = UserId.from(input.id);
    const user = await this.users.findById(userId);
    if (!user) {
      throw new UserNotFoundError(input.id);
    }

    user.changeRole(input.role);
    await this.users.save(user);

    return {
      id: user.id.value,
      email: user.email.value,
      role: user.getRole(),
      active: user.isActive(),
    };
  }
}
