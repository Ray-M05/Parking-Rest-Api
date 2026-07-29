import { Reservation } from '../entities/reservation.entity';
import { ReservationId } from '../value-objects/reservation-id.vo';
import { TimeSlot } from '../value-objects/time-slot.vo';
import { UserId } from '../../../users/domain/value-objects/user-id.vo';
import { VehicleId } from '../../../vehicles/domain/value-objects/vehicle-id.vo';

export interface ReserveSpotParams {
  userId: UserId;
  vehicleId: VehicleId;
  slot: TimeSlot;
}

export interface ReservationRepository {
  save(reservation: Reservation): Promise<void>;
  findById(id: ReservationId): Promise<Reservation | null>;
  findConfirmedOverlapping(slot: TimeSlot): Promise<Reservation[]>;
  findConfirmedActiveAt(instant: Date): Promise<Reservation[]>;
  reserveSpot(params: ReserveSpotParams): Promise<Reservation>;
  findAll(): Promise<Reservation[]>;
  delete(id: ReservationId): Promise<void>;
}

export const RESERVATION_REPOSITORY = Symbol('ReservationRepository');
