import { Inject, Injectable } from '@nestjs/common';
import {
  USER_REPOSITORY,
  type UserRepository,
} from '../../domain/ports/user.repository';
import { UserId } from '../../domain/value-objects/user-id.vo';
import { UserNotFoundError } from '../../domain/errors/user-not-found.error';

export interface ChangeUserStatusInput {
  id: string;
  active: boolean;
}

export interface ChangeUserStatusOutput {
  id: string;
  email: string;
  role: string;
  active: boolean;
}

@Injectable()
export class ChangeUserStatusUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
  ) {}

  async execute(input: ChangeUserStatusInput): Promise<ChangeUserStatusOutput> {
    const userId = UserId.from(input.id);
    const user = await this.users.findById(userId);
    if (!user) {
      throw new UserNotFoundError(input.id);
    }

    if (input.active) {
      user.activate();
    } else {
      user.deactivate();
    }
    await this.users.save(user);

    return {
      id: user.id.value,
      email: user.email.value,
      role: user.getRole(),
      active: user.isActive(),
    };
  }
}
