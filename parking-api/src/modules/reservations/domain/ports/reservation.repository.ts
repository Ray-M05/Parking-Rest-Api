import { Reservation } from '../entities/reservation.entity';
import { ReservationId } from '../value-objects/reservation-id.vo';
import { TimeSlot } from '../value-objects/time-slot.vo';

export interface ReservationRepository {
  save(reservation: Reservation): Promise<void>;
  findById(id: ReservationId): Promise<Reservation | null>;
  findConfirmedOverlapping(slot: TimeSlot): Promise<Reservation[]>;
  findAll(): Promise<Reservation[]>;
  delete(id: ReservationId): Promise<void>;
}

export const RESERVATION_REPOSITORY = Symbol('ReservationRepository');
