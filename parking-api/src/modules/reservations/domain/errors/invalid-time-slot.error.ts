export class InvalidTimeSlotError extends Error {
  constructor(start: Date, end: Date) {
    super(
      `TimeSlot inválido: start (${start.toISOString()}) debe ser anterior a end (${end.toISOString()}).`,
    );
    this.name = 'InvalidTimeSlotError';
  }
}
