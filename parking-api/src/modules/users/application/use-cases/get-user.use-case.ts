import { Inject, Injectable } from '@nestjs/common';
import {
  USER_REPOSITORY,
  type UserRepository,
} from '../../domain/ports/user.repository';
import { UserId } from '../../domain/value-objects/user-id.vo';
import { UserNotFoundError } from '../../domain/errors/user-not-found.error';

export interface GetUserOutput {
  id: string;
  email: string;
  role: string;
  active: boolean;
}

@Injectable()
export class GetUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
  ) {}

  async execute(id: string): Promise<GetUserOutput> {
    const userId = UserId.from(id);
    const user = await this.users.findById(userId);
    if (!user) {
      throw new UserNotFoundError(id);
    }

    return {
      id: user.id.value,
      email: user.email.value,
      role: user.getRole(),
      active: user.isActive(),
    };
  }
}
