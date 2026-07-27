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
    private _email: Email,
    private passwordHash: string,
    private role: Role,
    private active: boolean,
  ) {}

  static create(props: CreateUserProps): User {
    return new User(
      UserId.create(),
      props.email,
      props.passwordHash,
      props.role,
      true,
    );
  }

  static reconstitute(
    id: UserId,
    email: Email,
    passwordHash: string,
    role: Role,
    active: boolean,
  ): User {
    return new User(id, email, passwordHash, role, active);
  }

  get email(): Email {
    return this._email;
  }

  getPasswordHash(): string {
    return this.passwordHash;
  }

  getRole(): Role {
    return this.role;
  }

  isActive(): boolean {
    return this.active;
  }

  deactivate(): void {
    this.active = false;
  }

  activate(): void {
    this.active = true;
  }

  changeEmail(email: Email): void {
    this._email = email;
  }

  changePasswordHash(passwordHash: string): void {
    this.passwordHash = passwordHash;
  }

  changeRole(role: Role): void {
    this.role = role;
  }
}
