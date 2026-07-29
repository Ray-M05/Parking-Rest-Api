export class ReservationCreatedEvent {
  static readonly NAME = 'reservation.created';

  constructor(
    readonly reservationId: string,
    readonly userId: string,
    readonly vehicleId: string,
    readonly spotId: string,
    readonly start: Date,
    readonly end: Date,
  ) {}
}
