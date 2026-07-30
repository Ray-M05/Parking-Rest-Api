import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
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
import { UserUpdatedEvent } from '../../domain/events/user-updated.event';

export interface UpdateUserInput {
  id: string;
  actorId: string;
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
    private readonly events: EventEmitter2,
  ) {}

  async execute(input: UpdateUserInput): Promise<UpdateUserOutput> {
    const userId = UserId.from(input.id);
    const user = await this.users.findById(userId);
    if (!user) {
      throw new UserNotFoundError(input.id);
    }

    const changedFields: string[] = [];

    if (input.email) {
      const newEmail = new Email(input.email);
      if (!newEmail.equals(user.email)) {
        const existing = await this.users.findByEmail(newEmail);
        if (existing) {
          throw new EmailAlreadyInUseError(newEmail.value);
        }
        user.changeEmail(newEmail);
        changedFields.push('email');
      }
    }

    if (input.password) {
      const passwordHash = await this.hasher.hash(input.password);
      user.changePasswordHash(passwordHash);
      changedFields.push('password');
    }

    await this.users.save(user);

    if (changedFields.length > 0) {
      this.events.emit(
        UserUpdatedEvent.NAME,
        new UserUpdatedEvent(input.actorId, user.id.value, changedFields),
      );
    }

    return {
      id: user.id.value,
      email: user.email.value,
      role: user.getRole(),
      active: user.isActive(),
    };
  }
}
