export class ReservationCancelledEvent {
  static readonly NAME = 'reservation.cancelled';

  constructor(
    readonly reservationId: string,
    readonly userId: string,
    readonly reason?: string,
  ) {}
}
