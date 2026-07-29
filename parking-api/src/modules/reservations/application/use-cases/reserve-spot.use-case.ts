import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  RESERVATION_REPOSITORY,
  type ReservationRepository,
} from '../../domain/ports/reservation.repository';
import {
  VEHICLE_REPOSITORY,
  type VehicleRepository,
} from '../../../vehicles/domain/ports/vehicle.repository';
import { TimeSlot } from '../../domain/value-objects/time-slot.vo';
import { UserId } from '../../../users/domain/value-objects/user-id.vo';
import { VehicleId } from '../../../vehicles/domain/value-objects/vehicle-id.vo';
import { Role } from '../../../users/domain/enums/role.enum';
import { VehicleNotFoundError } from '../../../vehicles/domain/errors/vehicle-not-found.error';
import { VehicleNotOwnedError } from '../../../vehicles/domain/errors/vehicle-not-owned.error';
import { ReservationCreatedEvent } from '../../domain/events/reservation-created.event';

export interface ReserveSpotInput {
  userId: string;
  role: string;
  vehicleId: string;
  startTime: string;
  endTime: string;
}

export interface ReserveSpotOutput {
  id: string;
  spotId: string;
  vehicleId: string;
  userId: string;
  startTime: string;
  endTime: string;
  status: string;
}

@Injectable()
export class ReserveSpotUseCase {
  constructor(
    @Inject(RESERVATION_REPOSITORY)
    private readonly reservations: ReservationRepository,
    @Inject(VEHICLE_REPOSITORY)
    private readonly vehicles: VehicleRepository,
    private readonly events: EventEmitter2,
  ) {}

  async execute(input: ReserveSpotInput): Promise<ReserveSpotOutput> {
    const slot = TimeSlot.create(
      new Date(input.startTime),
      new Date(input.endTime),
    );

    const userId = UserId.from(input.userId);
    const vehicleId = VehicleId.from(input.vehicleId);

    const vehicle = await this.vehicles.findById(vehicleId);
    if (!vehicle) {
      throw new VehicleNotFoundError(input.vehicleId);
    }
    const isAdmin = (input.role as Role) === Role.Admin;
    if (!isAdmin && !vehicle.belongsTo(userId)) {
      throw new VehicleNotOwnedError(input.vehicleId);
    }

    const reservation = await this.reservations.reserveSpot({
      userId,
      vehicleId,
      slot,
    });

    this.events.emit(
      ReservationCreatedEvent.NAME,
      new ReservationCreatedEvent(
        reservation.id.value,
        reservation.userId.value,
        reservation.vehicleId.value,
        reservation.spotId.value,
        reservation.slot.start,
        reservation.slot.end,
      ),
    );

    return {
      id: reservation.id.value,
      spotId: reservation.spotId.value,
      vehicleId: reservation.vehicleId.value,
      userId: reservation.userId.value,
      startTime: reservation.slot.start.toISOString(),
      endTime: reservation.slot.end.toISOString(),
      status: reservation.getStatus(),
    };
  }
}
