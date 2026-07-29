import { SpotId } from '../value-objects/spot-id.vo';
import { InvalidParkingSpotCodeError } from '../errors/invalid-parking-spot-code.error';

export class ParkingSpot {
  private constructor(
    readonly id: SpotId,
    private _code: string,
    private active: boolean,
  ) {}

  static create(code: string): ParkingSpot {
    return new ParkingSpot(SpotId.create(), ParkingSpot.normalize(code), true);
  }

  static reconstitute(id: SpotId, code: string, active: boolean): ParkingSpot {
    return new ParkingSpot(id, code, active);
  }

  private static normalize(code: string): string {
    const trimmed = code.trim();
    if (trimmed.length === 0) {
      throw new InvalidParkingSpotCodeError(code);
    }
    return trimmed.toUpperCase();
  }

  get code(): string {
    return this._code;
  }

  changeCode(code: string): void {
    this._code = ParkingSpot.normalize(code);
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
