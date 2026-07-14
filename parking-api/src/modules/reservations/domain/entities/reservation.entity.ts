import { ReservationId } from '../value-objects/reservation-id.vo';
import { UserId } from '../../../users/domain/value-objects/user-id.vo';
import { VehicleId } from '../../../vehicles/domain/value-objects/vehicle-id.vo';
import { SpotId } from '../../../spots/domain/value-objects/spot-id.vo';
import { TimeSlot } from '../value-objects/time-slot.vo';
import { ReservationStatus } from '../enums/reservation-status.enum';

export interface CreateReservationProps {
  userId: UserId;
  vehicleId: VehicleId;
  spotId: SpotId;
  slot: TimeSlot;
}

export class Reservation {
  private constructor(
    readonly id: ReservationId,
    readonly userId: UserId,
    readonly vehicleId: VehicleId,
    readonly spotId: SpotId,
    readonly slot: TimeSlot,
    private status: ReservationStatus,
  ) {}

  static create(props: CreateReservationProps): Reservation {
    return new Reservation(
      ReservationId.create(),
      props.userId,
      props.vehicleId,
      props.spotId,
      props.slot,
      ReservationStatus.Pending,
    );
  }

  static reconstitute(
    id: ReservationId,
    userId: UserId,
    vehicleId: VehicleId,
    spotId: SpotId,
    slot: TimeSlot,
    status: ReservationStatus,
  ): Reservation {
    return new Reservation(id, userId, vehicleId, spotId, slot, status);
  }

  confirm(): void {
    this.status = ReservationStatus.Confirmed;
  }

  cancel(): void {
    this.status = ReservationStatus.Cancelled;
  }

  getStatus(): ReservationStatus {
    return this.status;
  }
}
