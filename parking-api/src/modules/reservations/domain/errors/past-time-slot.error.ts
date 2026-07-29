export class PastTimeSlotError extends Error {
  constructor(start: Date) {
    super(
      `No se puede reservar en el pasado: el inicio (${start.toISOString()}) es anterior a ahora.`,
    );
    this.name = 'PastTimeSlotError';
  }
}
