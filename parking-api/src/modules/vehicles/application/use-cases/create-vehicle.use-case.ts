import { Inject, Injectable } from '@nestjs/common';
import {
  VEHICLE_REPOSITORY,
  type VehicleRepository,
} from '../../domain/ports/vehicle.repository';
import {
  USER_REPOSITORY,
  type UserRepository,
} from '../../../users/domain/ports/user.repository';
import { Vehicle } from '../../domain/entities/vehicle.entity';
import { Plate } from '../../domain/value-objects/plate.vo';
import { UserId } from '../../../users/domain/value-objects/user-id.vo';
import { Role } from '../../../users/domain/enums/role.enum';
import { PlateAlreadyInUseError } from '../../domain/errors/plate-already-in-use.error';
import { UserNotFoundError } from '../../../users/domain/errors/user-not-found.error';

export interface CreateVehicleInput {
  requesterId: string;
  requesterRole: string;
  plate: string;
  ownerId?: string;
}

export interface CreateVehicleOutput {
  id: string;
  ownerId: string;
  plate: string;
}

@Injectable()
export class CreateVehicleUseCase {
  constructor(
    @Inject(VEHICLE_REPOSITORY) private readonly vehicles: VehicleRepository,
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
  ) {}

  async execute(input: CreateVehicleInput): Promise<CreateVehicleOutput> {
    const isAdmin = (input.requesterRole as Role) === Role.Admin;
    const ownerId = UserId.from(
      isAdmin && input.ownerId ? input.ownerId : input.requesterId,
    );

    if (isAdmin && input.ownerId) {
      const owner = await this.users.findById(ownerId);
      if (!owner) {
        throw new UserNotFoundError(input.ownerId);
      }
    }

    const plate = new Plate(input.plate);
    const existing = await this.vehicles.findByPlate(plate);
    if (existing) {
      throw new PlateAlreadyInUseError(plate.value);
    }

    const vehicle = Vehicle.create(ownerId, plate);
    await this.vehicles.save(vehicle);

    return {
      id: vehicle.id.value,
      ownerId: vehicle.ownerId.value,
      plate: vehicle.plate.value,
    };
  }
}
