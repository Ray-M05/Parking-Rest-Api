export class VehicleNotOwnedError extends Error {
  constructor(vehicleId: string) {
    super(`El vehículo "${vehicleId}" no pertenece al usuario.`);
    this.name = 'VehicleNotOwnedError';
  }
}
