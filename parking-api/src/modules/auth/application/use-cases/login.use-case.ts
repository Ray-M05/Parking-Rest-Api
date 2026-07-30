import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  USER_REPOSITORY,
  type UserRepository,
} from '../../../users/domain/ports/user.repository';
import { Email } from '../../../users/domain/value-objects/email.vo';
import {
  PASSWORD_HASHER,
  type PasswordHasher,
} from '../../../../shared/hashing/domain/ports/password-hasher.port';
import {
  TOKEN_ISSUER,
  type TokenIssuer,
} from '../../domain/ports/token-issuer.port';
import { InvalidCredentialsError } from '../../domain/errors/invalid-credentials.error';
import { UserLoggedInEvent } from '../../domain/events/user-logged-in.event';

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
    private readonly events: EventEmitter2,
  ) {}

  private emitLogin(userId: string | null, email: string, success: boolean) {
    this.events.emit(
      UserLoggedInEvent.NAME,
      new UserLoggedInEvent(userId, email, success),
    );
  }

  async execute(input: LoginInput): Promise<LoginOutput> {
    let email: Email;
    try {
      email = new Email(input.email);
    } catch {
      this.emitLogin(null, input.email, false);
      throw new InvalidCredentialsError();
    }

    const user = await this.users.findByEmail(email);
    if (!user || !user.isActive()) {
      this.emitLogin(user?.id.value ?? null, email.value, false);
      throw new InvalidCredentialsError();
    }

    const passwordOk = await this.hasher.compare(
      input.password,
      user.getPasswordHash(),
    );
    if (!passwordOk) {
      this.emitLogin(user.id.value, email.value, false);
      throw new InvalidCredentialsError();
    }

    const accessToken = this.tokens.sign({
      sub: user.id.value,
      email: user.email.value,
      role: user.getRole(),
    });

    this.emitLogin(user.id.value, user.email.value, true);

    return { accessToken };
  }
}
