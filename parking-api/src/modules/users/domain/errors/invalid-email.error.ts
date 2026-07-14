export class InvalidEmailError extends Error {
  constructor(value: string) {
    super(`Email inválido: "${value}"`);
    this.name = 'InvalidEmailError';
  }
}
