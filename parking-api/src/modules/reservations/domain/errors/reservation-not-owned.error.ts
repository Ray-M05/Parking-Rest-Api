export class ReservationNotOwnedError extends Error {
  constructor(reservationId: string) {
    super(`La reserva "${reservationId}" no pertenece al usuario.`);
    this.name = 'ReservationNotOwnedError';
  }
}
