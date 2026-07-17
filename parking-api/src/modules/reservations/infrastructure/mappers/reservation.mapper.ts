import { Reservation } from '../../domain/entities/reservation.entity';
import { ReservationId } from '../../domain/value-objects/reservation-id.vo';
import { TimeSlot } from '../../domain/value-objects/time-slot.vo';
import { ReservationStatus } from '../../domain/enums/reservation-status.enum';
import { UserId } from '../../../users/domain/value-objects/user-id.vo';
import { VehicleId } from '../../../vehicles/domain/value-objects/vehicle-id.vo';
import { SpotId } from '../../../spots/domain/value-objects/spot-id.vo';
import { ReservationOrmEntity } from '../persistence/reservation.orm-entity';

export class ReservationMapper {
  static toDomain(orm: ReservationOrmEntity): Reservation {
    return Reservation.reconstitute(
      ReservationId.from(orm.id),
      UserId.from(orm.userId),
      VehicleId.from(orm.vehicleId),
      SpotId.from(orm.spotId),
      new TimeSlot(orm.startTime, orm.endTime),
      orm.status as ReservationStatus,
    );
  }

  static toPersistence(reservation: Reservation): ReservationOrmEntity {
    const orm = new ReservationOrmEntity();
    orm.id = reservation.id.value;
    orm.userId = reservation.userId.value;
    orm.vehicleId = reservation.vehicleId.value;
    orm.spotId = reservation.spotId.value;
    orm.startTime = reservation.slot.start;
    orm.endTime = reservation.slot.end;
    orm.status = reservation.getStatus();
    return orm;
  }
}
