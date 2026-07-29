export class ReservationAlreadyCancelledError extends Error {
  constructor(reservationId: string) {
    super(`La reserva "${reservationId}" ya está cancelada.`);
    this.name = 'ReservationAlreadyCancelledError';
  }
}
