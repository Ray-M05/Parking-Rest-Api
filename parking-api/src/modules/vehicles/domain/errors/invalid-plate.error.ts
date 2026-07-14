export class InvalidPlateError extends Error {
  constructor(value: string) {
    super(`Plate inválida: "${value}"`);
    this.name = 'InvalidPlateError';
  }
}
