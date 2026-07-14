import { v4 as uuidv4, validate as isUuid } from 'uuid';
import { InvalidUserIdError } from '../errors/invalid-user-id.error';

export class UserId {
  private constructor(readonly value: string) {}

  static create(): UserId {
    return new UserId(uuidv4());
  }

  static from(value: string): UserId {
    if (!isUuid(value)) {
      throw new InvalidUserIdError(value);
    }
    return new UserId(value);
  }

  equals(other: UserId): boolean {
    return this.value === other.value;
  }
}
