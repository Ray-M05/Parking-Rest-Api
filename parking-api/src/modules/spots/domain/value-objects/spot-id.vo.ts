import { v4 as uuidv4, validate as isUuid } from 'uuid';
import { InvalidSpotIdError } from '../errors/invalid-spot-id.error';

export class SpotId {
  private constructor(readonly value: string) {}

  static create(): SpotId {
    return new SpotId(uuidv4());
  }

  static from(value: string): SpotId {
    if (!isUuid(value)) {
      throw new InvalidSpotIdError(value);
    }
    return new SpotId(value);
  }

  equals(other: SpotId): boolean {
    return this.value === other.value;
  }
}
