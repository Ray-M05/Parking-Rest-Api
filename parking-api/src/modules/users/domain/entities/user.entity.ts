import { UserId } from '../value-objects/user-id.vo';
import { Email } from '../value-objects/email.vo';
import { Role } from '../enums/role.enum';

export interface CreateUserProps {
  email: Email;
  passwordHash: string;
  role: Role;
}

export class User {
  private constructor(
    readonly id: UserId,
    readonly email: Email,
    private passwordHash: string,
    private role: Role,
  ) {}

  static create(props: CreateUserProps): User {
    return new User(
      UserId.create(),
      props.email,
      props.passwordHash,
      props.role,
    );
  }

  static reconstitute(
    id: UserId,
    email: Email,
    passwordHash: string,
    role: Role,
  ): User {
    return new User(id, email, passwordHash, role);
  }

  getPasswordHash(): string {
    return this.passwordHash;
  }

  getRole(): Role {
    return this.role;
  }
}
