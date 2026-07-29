export class SpotNotFoundError extends Error {
  constructor(id: string) {
    super(`Plaza no encontrada: "${id}"`);
    this.name = 'SpotNotFoundError';
  }
}
