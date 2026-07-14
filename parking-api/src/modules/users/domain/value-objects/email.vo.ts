import { InvalidEmailError } from '../errors/invalid-email.error';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class Email {
  readonly value: string;

  constructor(value: string) {
    const normalized = value.trim().toLowerCase();
    if (!EMAIL_REGEX.test(normalized)) {
      throw new InvalidEmailError(value);
    }
    this.value = normalized;
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }
}
