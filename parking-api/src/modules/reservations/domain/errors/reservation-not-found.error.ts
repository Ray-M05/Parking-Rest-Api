export class ReservationNotFoundError extends Error {
  constructor(id: string) {
    super(`Reserva no encontrada: "${id}"`);
    this.name = 'ReservationNotFoundError';
  }
}
