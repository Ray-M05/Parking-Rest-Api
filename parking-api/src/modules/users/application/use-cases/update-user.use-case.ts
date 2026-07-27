import { Inject, Injectable } from '@nestjs/common';
import {
  USER_REPOSITORY,
  type UserRepository,
} from '../../domain/ports/user.repository';
import { UserId } from '../../domain/value-objects/user-id.vo';
import { Email } from '../../domain/value-objects/email.vo';
import { UserNotFoundError } from '../../domain/errors/user-not-found.error';
import { EmailAlreadyInUseError } from '../../domain/errors/email-already-in-use.error';
import {
  PASSWORD_HASHER,
  type PasswordHasher,
} from '../../../../shared/hashing/domain/ports/password-hasher.port';

export interface UpdateUserInput {
  id: string;
  email?: string;
  password?: string;
}

export interface UpdateUserOutput {
  id: string;
  email: string;
  role: string;
  active: boolean;
}

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
    @Inject(PASSWORD_HASHER) private readonly hasher: PasswordHasher,
  ) {}

  async execute(input: UpdateUserInput): Promise<UpdateUserOutput> {
    const userId = UserId.from(input.id);
    const user = await this.users.findById(userId);
    if (!user) {
      throw new UserNotFoundError(input.id);
    }

    if (input.email) {
      const newEmail = new Email(input.email);
      if (!newEmail.equals(user.email)) {
        const existing = await this.users.findByEmail(newEmail);
        if (existing) {
          throw new EmailAlreadyInUseError(newEmail.value);
        }
        user.changeEmail(newEmail);
      }
    }

    if (input.password) {
      const passwordHash = await this.hasher.hash(input.password);
      user.changePasswordHash(passwordHash);
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
