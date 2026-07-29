import { Inject, Injectable } from '@nestjs/common';
import {
  RESERVATION_REPOSITORY,
  type ReservationRepository,
} from '../../domain/ports/reservation.repository';
import { ReservationId } from '../../domain/value-objects/reservation-id.vo';
import { ReservationNotFoundError } from '../../domain/errors/reservation-not-found.error';

export interface DeleteReservationInput {
  id: string;
}

@Injectable()
export class DeleteReservationUseCase {
  constructor(
    @Inject(RESERVATION_REPOSITORY)
    private readonly reservations: ReservationRepository,
  ) {}

  async execute(input: DeleteReservationInput): Promise<void> {
    const reservationId = ReservationId.from(input.id);
    const reservation = await this.reservations.findById(reservationId);
    if (!reservation) {
      throw new ReservationNotFoundError(input.id);
    }

    await this.reservations.delete(reservationId);
  }
}
