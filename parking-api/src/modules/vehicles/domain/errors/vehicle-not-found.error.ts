export class VehicleNotFoundError extends Error {
  constructor(id: string) {
    super(`Vehículo no encontrado: "${id}"`);
    this.name = 'VehicleNotFoundError';
  }
}
