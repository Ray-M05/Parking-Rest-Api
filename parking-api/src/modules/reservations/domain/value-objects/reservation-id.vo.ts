import { v4 as uuidv4, validate as isUuid } from 'uuid';
import { InvalidReservationIdError } from '../errors/invalid-reservation-id.error';

export class ReservationId {
  private constructor(readonly value: string) {}

  static create(): ReservationId {
    return new ReservationId(uuidv4());
  }

  static from(value: string): ReservationId {
    if (!isUuid(value)) {
      throw new InvalidReservationIdError(value);
    }
    return new ReservationId(value);
  }

  equals(other: ReservationId): boolean {
    return this.value === other.value;
  }
}
