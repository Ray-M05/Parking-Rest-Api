import { ParkingSpot } from '../../domain/entities/parking-spot.entity';
import { SpotId } from '../../domain/value-objects/spot-id.vo';
import { ParkingSpotOrmEntity } from '../persistence/parking-spot.orm-entity';

export class ParkingSpotMapper {
  static toDomain(orm: ParkingSpotOrmEntity): ParkingSpot {
    return ParkingSpot.reconstitute(SpotId.from(orm.id), orm.code, orm.active);
  }

  static toPersistence(spot: ParkingSpot): ParkingSpotOrmEntity {
    const orm = new ParkingSpotOrmEntity();
    orm.id = spot.id.value;
    orm.code = spot.code;
    orm.active = spot.isActive();
    return orm;
  }
}
