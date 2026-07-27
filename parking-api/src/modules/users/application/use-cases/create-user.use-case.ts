import { Inject, Injectable } from '@nestjs/common';
import {
  USER_REPOSITORY,
  type UserRepository,
} from '../../domain/ports/user.repository';
import { User } from '../../domain/entities/user.entity';
import { Email } from '../../domain/value-objects/email.vo';
import { Role } from '../../domain/enums/role.enum';
import { EmailAlreadyInUseError } from '../../domain/errors/email-already-in-use.error';
import {
  PASSWORD_HASHER,
  type PasswordHasher,
} from '../../../../shared/hashing/domain/ports/password-hasher.port';

export interface CreateUserInput {
  email: string;
  password: string;
  role: Role;
}

export interface CreateUserOutput {
  id: string;
  email: string;
  role: string;
  active: boolean;
}

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
    @Inject(PASSWORD_HASHER) private readonly hasher: PasswordHasher,
  ) {}

  async execute(input: CreateUserInput): Promise<CreateUserOutput> {
    const email = new Email(input.email);

    const existing = await this.users.findByEmail(email);
    if (existing) {
      throw new EmailAlreadyInUseError(email.value);
    }

    const passwordHash = await this.hasher.hash(input.password);
    const user = User.create({ email, passwordHash, role: input.role });
    await this.users.save(user);

    return {
      id: user.id.value,
      email: user.email.value,
      role: user.getRole(),
      active: user.isActive(),
    };
  }
}
