export class VehicleAlreadyReservedError extends Error {
  constructor(vehicleId: string) {
    super(
      `El vehículo "${vehicleId}" ya tiene una reserva confirmada que solapa esa franja.`,
    );
    this.name = 'VehicleAlreadyReservedError';
  }
}
