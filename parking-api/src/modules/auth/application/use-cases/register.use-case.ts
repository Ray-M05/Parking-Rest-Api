import { Inject, Injectable } from '@nestjs/common';
import {
  USER_REPOSITORY,
  type UserRepository,
} from '../../../users/domain/ports/user.repository';
import { User } from '../../../users/domain/entities/user.entity';
import { Email } from '../../../users/domain/value-objects/email.vo';
import { Role } from '../../../users/domain/enums/role.enum';
import {
  PASSWORD_HASHER,
  type PasswordHasher,
} from '../../domain/ports/password-hasher.port';
import { EmailAlreadyInUseError } from '../../domain/errors/email-already-in-use.error';

export interface RegisterInput {
  email: string;
  password: string;
}

export interface RegisterOutput {
  id: string;
  email: string;
  role: string;
}

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
    @Inject(PASSWORD_HASHER) private readonly hasher: PasswordHasher,
  ) {}

  async execute(input: RegisterInput): Promise<RegisterOutput> {
    const email = new Email(input.email);

    const existing = await this.users.findByEmail(email);
    if (existing) {
      throw new EmailAlreadyInUseError(email.value);
    }

    const passwordHash = await this.hasher.hash(input.password);
    const user = User.create({ email, passwordHash, role: Role.Client });
    await this.users.save(user);

    return { id: user.id.value, email: user.email.value, role: user.getRole() };
  }
}
