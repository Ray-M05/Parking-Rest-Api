import { Inject, Injectable } from '@nestjs/common';
import {
  VEHICLE_REPOSITORY,
  type VehicleRepository,
} from '../../domain/ports/vehicle.repository';
import { VehicleId } from '../../domain/value-objects/vehicle-id.vo';
import { UserId } from '../../../users/domain/value-objects/user-id.vo';
import { Role } from '../../../users/domain/enums/role.enum';
import { VehicleNotFoundError } from '../../domain/errors/vehicle-not-found.error';
import { VehicleNotOwnedError } from '../../domain/errors/vehicle-not-owned.error';

export interface GetVehicleInput {
  id: string;
  requesterId: string;
  requesterRole: string;
}

export interface GetVehicleOutput {
  id: string;
  ownerId: string;
  plate: string;
}

@Injectable()
export class GetVehicleUseCase {
  constructor(
    @Inject(VEHICLE_REPOSITORY) private readonly vehicles: VehicleRepository,
  ) {}

  async execute(input: GetVehicleInput): Promise<GetVehicleOutput> {
    const vehicleId = VehicleId.from(input.id);
    const vehicle = await this.vehicles.findById(vehicleId);
    if (!vehicle) {
      throw new VehicleNotFoundError(input.id);
    }

    const isAdmin = (input.requesterRole as Role) === Role.Admin;
    if (!isAdmin && !vehicle.belongsTo(UserId.from(input.requesterId))) {
      throw new VehicleNotOwnedError(input.id);
    }

    return {
      id: vehicle.id.value,
      ownerId: vehicle.ownerId.value,
      plate: vehicle.plate.value,
    };
  }
}
