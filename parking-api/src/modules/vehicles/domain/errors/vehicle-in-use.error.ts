export class VehicleInUseError extends Error {
  constructor(id: string) {
    super(
      `El vehículo "${id}" no se puede eliminar: tiene reservas asociadas.`,
    );
    this.name = 'VehicleInUseError';
  }
}
