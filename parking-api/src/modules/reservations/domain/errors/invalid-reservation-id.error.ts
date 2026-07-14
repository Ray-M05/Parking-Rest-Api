export class InvalidReservationIdError extends Error {
  constructor(value: string) {
    super(`ReservationId inválido: "${value}" no es un UUID válido.`);
    this.name = 'InvalidReservationIdError';
  }
}
