import { Inject, Injectable } from '@nestjs/common';
import {
  USER_REPOSITORY,
  type UserRepository,
} from '../../../users/domain/ports/user.repository';
import { Email } from '../../../users/domain/value-objects/email.vo';
import {
  PASSWORD_HASHER,
  type PasswordHasher,
} from '../../domain/ports/password-hasher.port';
import {
  TOKEN_ISSUER,
  type TokenIssuer,
} from '../../domain/ports/token-issuer.port';
import { InvalidCredentialsError } from '../../domain/errors/invalid-credentials.error';

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginOutput {
  accessToken: string;
}

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
    @Inject(PASSWORD_HASHER) private readonly hasher: PasswordHasher,
    @Inject(TOKEN_ISSUER) private readonly tokens: TokenIssuer,
  ) {}

  async execute(input: LoginInput): Promise<LoginOutput> {
    let email: Email;
    try {
      email = new Email(input.email);
    } catch {
      throw new InvalidCredentialsError();
    }

    const user = await this.users.findByEmail(email);
    if (!user) {
      throw new InvalidCredentialsError();
    }

    const passwordOk = await this.hasher.compare(
      input.password,
      user.getPasswordHash(),
    );
    if (!passwordOk) {
      throw new InvalidCredentialsError();
    }

    const accessToken = this.tokens.sign({
      sub: user.id.value,
      email: user.email.value,
      role: user.getRole(),
    });

    return { accessToken };
  }
}
