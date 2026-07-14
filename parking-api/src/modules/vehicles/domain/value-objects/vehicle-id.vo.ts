import { v4 as uuidv4, validate as isUuid } from 'uuid';
import { InvalidVehicleIdError } from '../errors/invalid-vehicle-id.error';

export class VehicleId {
  private constructor(readonly value: string) {}

  static create(): VehicleId {
    return new VehicleId(uuidv4());
  }

  static from(value: string): VehicleId {
    if (!isUuid(value)) {
      throw new InvalidVehicleIdError(value);
    }
    return new VehicleId(value);
  }

  equals(other: VehicleId): boolean {
    return this.value === other.value;
  }
}
