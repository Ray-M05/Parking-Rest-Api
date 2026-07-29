export class SpotCodeAlreadyInUseError extends Error {
  constructor(code: string) {
    super(`El código de plaza "${code}" ya está en uso.`);
    this.name = 'SpotCodeAlreadyInUseError';
  }
}
