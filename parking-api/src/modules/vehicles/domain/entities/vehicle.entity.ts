import { VehicleId } from '../value-objects/vehicle-id.vo';
import { Plate } from '../value-objects/plate.vo';
import { UserId } from '../../../users/domain/value-objects/user-id.vo';

export class Vehicle {
  private constructor(
    readonly id: VehicleId,
    readonly ownerId: UserId,
    readonly plate: Plate,
  ) {}

  static create(ownerId: UserId, plate: Plate): Vehicle {
    return new Vehicle(VehicleId.create(), ownerId, plate);
  }

  static reconstitute(id: VehicleId, ownerId: UserId, plate: Plate): Vehicle {
    return new Vehicle(id, ownerId, plate);
  }

  belongsTo(userId: UserId): boolean {
    return this.ownerId.equals(userId);
  }
}
