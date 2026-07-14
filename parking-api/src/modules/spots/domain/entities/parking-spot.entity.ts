import { SpotId } from '../value-objects/spot-id.vo';
import { InvalidParkingSpotCodeError } from '../errors/invalid-parking-spot-code.error';

export class ParkingSpot {
  private constructor(
    readonly id: SpotId,
    readonly code: string,
    private active: boolean,
  ) {}

  static create(code: string): ParkingSpot {
    const trimmed = code.trim();
    if (trimmed.length === 0) {
      throw new InvalidParkingSpotCodeError(code);
    }
    return new ParkingSpot(SpotId.create(), trimmed.toUpperCase(), true);
  }

  static reconstitute(id: SpotId, code: string, active: boolean): ParkingSpot {
    return new ParkingSpot(id, code, active);
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
}
