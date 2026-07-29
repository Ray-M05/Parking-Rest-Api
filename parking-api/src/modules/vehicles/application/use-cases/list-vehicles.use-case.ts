import { Inject, Injectable } from '@nestjs/common';
import {
  VEHICLE_REPOSITORY,
  type VehicleRepository,
} from '../../domain/ports/vehicle.repository';
import { UserId } from '../../../users/domain/value-objects/user-id.vo';
import { Role } from '../../../users/domain/enums/role.enum';

export interface ListVehiclesInput {
  requesterId: string;
  requesterRole: string;
  page: number;
  limit: number;
}

export interface ListVehiclesOutput {
  data: Array<{ id: string; ownerId: string; plate: string }>;
  total: number;
  page: number;
  limit: number;
}

@Injectable()
export class ListVehiclesUseCase {
  constructor(
    @Inject(VEHICLE_REPOSITORY) private readonly vehicles: VehicleRepository,
  ) {}

  async execute(input: ListVehiclesInput): Promise<ListVehiclesOutput> {
    const isAdmin = (input.requesterRole as Role) === Role.Admin;
    const ownerId = isAdmin ? undefined : UserId.from(input.requesterId);

    const { data, total } = await this.vehicles.findPaginated(
      input.page,
      input.limit,
      ownerId,
    );

    return {
      data: data.map((vehicle) => ({
        id: vehicle.id.value,
        ownerId: vehicle.ownerId.value,
        plate: vehicle.plate.value,
      })),
      total,
      page: input.page,
      limit: input.limit,
    };
  }
}
