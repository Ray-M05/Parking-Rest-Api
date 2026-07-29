import { Inject, Injectable } from '@nestjs/common';
import {
  RESERVATION_REPOSITORY,
  type ReservationRepository,
} from '../../domain/ports/reservation.repository';
import { ReservationId } from '../../domain/value-objects/reservation-id.vo';
import { UserId } from '../../../users/domain/value-objects/user-id.vo';
import { Role } from '../../../users/domain/enums/role.enum';
import { ReservationNotFoundError } from '../../domain/errors/reservation-not-found.error';
import { ReservationNotOwnedError } from '../../domain/errors/reservation-not-owned.error';

export interface GetReservationInput {
  id: string;
  requesterId: string;
  requesterRole: string;
}

export interface GetReservationOutput {
  id: string;
  spotId: string;
  vehicleId: string;
  userId: string;
  startTime: string;
  endTime: string;
  status: string;
}

@Injectable()
export class GetReservationUseCase {
  constructor(
    @Inject(RESERVATION_REPOSITORY)
    private readonly reservations: ReservationRepository,
  ) {}

  async execute(input: GetReservationInput): Promise<GetReservationOutput> {
    const reservationId = ReservationId.from(input.id);
    const reservation = await this.reservations.findById(reservationId);
    if (!reservation) {
      throw new ReservationNotFoundError(input.id);
    }

    const isAdminOrEmployee =
      (input.requesterRole as Role) === Role.Admin ||
      (input.requesterRole as Role) === Role.Employee;
    if (
      !isAdminOrEmployee &&
      !reservation.userId.equals(UserId.from(input.requesterId))
    ) {
      throw new ReservationNotOwnedError(input.id);
    }

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
