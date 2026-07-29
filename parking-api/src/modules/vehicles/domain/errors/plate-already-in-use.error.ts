export class PlateAlreadyInUseError extends Error {
  constructor(plate: string) {
    super(`La matrícula "${plate}" ya está en uso.`);
    this.name = 'PlateAlreadyInUseError';
  }
}
