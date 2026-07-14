export class InvalidSpotIdError extends Error {
  constructor(value: string) {
    super(`SpotId inválido: "${value}" no es un UUID válido.`);
    this.name = 'InvalidSpotIdError';
  }
}
