import { InvalidPlateError } from '../errors/invalid-plate.error';

const PLATE_REGEX = /^[A-Z]{3}[0-9]{3,4}$/;

export class Plate {
  readonly value: string;

  constructor(value: string) {
    const normalized = value.trim().toUpperCase().replace(/[\s-]/g, '');
    if (!PLATE_REGEX.test(normalized)) {
      throw new InvalidPlateError(value);
    }
    this.value = normalized;
  }

  equals(other: Plate): boolean {
    return this.value === other.value;
  }
}
