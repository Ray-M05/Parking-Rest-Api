import { Vehicle } from '../../domain/entities/vehicle.entity';
import { VehicleId } from '../../domain/value-objects/vehicle-id.vo';
import { Plate } from '../../domain/value-objects/plate.vo';
import { UserId } from '../../../users/domain/value-objects/user-id.vo';
import { VehicleOrmEntity } from '../persistence/vehicle.orm-entity';

export class VehicleMapper {
  static toDomain(orm: VehicleOrmEntity): Vehicle {
    return Vehicle.reconstitute(
      VehicleId.from(orm.id),
      UserId.from(orm.ownerId),
      new Plate(orm.plate),
    );
  }

  static toPersistence(vehicle: Vehicle): VehicleOrmEntity {
    const orm = new VehicleOrmEntity();
    orm.id = vehicle.id.value;
    orm.ownerId = vehicle.ownerId.value;
    orm.plate = vehicle.plate.value;
    return orm;
  }
}
