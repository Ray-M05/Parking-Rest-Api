import { Inject, Injectable } from '@nestjs/common';
import {
  USER_REPOSITORY,
  type UserRepository,
} from '../../domain/ports/user.repository';
import { UserId } from '../../domain/value-objects/user-id.vo';
import { UserNotFoundError } from '../../domain/errors/user-not-found.error';

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const userId = UserId.from(id);
    const user = await this.users.findById(userId);
    if (!user) {
      throw new UserNotFoundError(id);
    }

    user.deactivate();
    await this.users.save(user);
  }
}
