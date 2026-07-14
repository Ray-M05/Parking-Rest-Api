export class InvalidParkingSpotCodeError extends Error {
  constructor(value: string) {
    super(`Código de plaza inválido: "${value}" no puede estar vacío.`);
    this.name = 'InvalidParkingSpotCodeError';
  }
}
