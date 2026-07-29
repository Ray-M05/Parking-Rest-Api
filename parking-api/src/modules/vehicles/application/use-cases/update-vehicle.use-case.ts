import { Inject, Injectable } from '@nestjs/common';
import {
  VEHICLE_REPOSITORY,
  type VehicleRepository,
} from '../../domain/ports/vehicle.repository';
import { VehicleId } from '../../domain/value-objects/vehicle-id.vo';
import { UserId } from '../../../users/domain/value-objects/user-id.vo';
import { Plate } from '../../domain/value-objects/plate.vo';
import { Role } from '../../../users/domain/enums/role.enum';
import { VehicleNotFoundError } from '../../domain/errors/vehicle-not-found.error';
import { VehicleNotOwnedError } from '../../domain/errors/vehicle-not-owned.error';
import { PlateAlreadyInUseError } from '../../domain/errors/plate-already-in-use.error';

export interface UpdateVehicleInput {
  id: string;
  requesterId: string;
  requesterRole: string;
  plate: string;
}

export interface UpdateVehicleOutput {
  id: string;
  ownerId: string;
  plate: string;
}

@Injectable()
export class UpdateVehicleUseCase {
  constructor(
    @Inject(VEHICLE_REPOSITORY) private readonly vehicles: VehicleRepository,
  ) {}

  async execute(input: UpdateVehicleInput): Promise<UpdateVehicleOutput> {
    const vehicleId = VehicleId.from(input.id);
    const vehicle = await this.vehicles.findById(vehicleId);
    if (!vehicle) {
      throw new VehicleNotFoundError(input.id);
    }

    const isAdmin = (input.requesterRole as Role) === Role.Admin;
    if (!isAdmin && !vehicle.belongsTo(UserId.from(input.requesterId))) {
      throw new VehicleNotOwnedError(input.id);
    }

    const plate = new Plate(input.plate);
    const existing = await this.vehicles.findByPlate(plate);
    if (existing && !existing.id.equals(vehicle.id)) {
      throw new PlateAlreadyInUseError(plate.value);
    }

    vehicle.changePlate(plate);
    await this.vehicles.save(vehicle);

    return {
      id: vehicle.id.value,
      ownerId: vehicle.ownerId.value,
      plate: vehicle.plate.value,
    };
  }
}
