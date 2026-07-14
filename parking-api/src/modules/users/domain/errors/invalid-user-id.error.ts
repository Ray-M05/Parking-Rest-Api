export class InvalidUserIdError extends Error {
  constructor(value: string) {
    super(`UserId inválido: "${value}" no es un UUID válido.`);
    this.name = 'InvalidUserIdError';
  }
}
