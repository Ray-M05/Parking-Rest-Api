export class InvalidVehicleIdError extends Error {
  constructor(value: string) {
    super(`VehicleId inválido: "${value}" no es un UUID válido.`);
    this.name = 'InvalidVehicleIdError';
  }
}
