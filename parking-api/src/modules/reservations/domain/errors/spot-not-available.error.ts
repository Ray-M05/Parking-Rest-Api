export class SpotNotAvailableError extends Error {
  constructor() {
    super('No hay plazas disponibles para la franja solicitada.');
    this.name = 'SpotNotAvailableError';
  }
}
