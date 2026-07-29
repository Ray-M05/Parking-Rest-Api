import { Vehicle } from '../entities/vehicle.entity';
import { VehicleId } from '../value-objects/vehicle-id.vo';
import { UserId } from '../../../users/domain/value-objects/user-id.vo';
import { Plate } from '../value-objects/plate.vo';

export interface PaginatedVehicles {
  data: Vehicle[];
  total: number;
}

export interface VehicleRepository {
  save(vehicle: Vehicle): Promise<void>;
  findById(id: VehicleId): Promise<Vehicle | null>;
  findByPlate(plate: Plate): Promise<Vehicle | null>;
  findByOwnerId(ownerId: UserId): Promise<Vehicle[]>;
  findAll(): Promise<Vehicle[]>;
  findPaginated(
    page: number,
    limit: number,
    ownerId?: UserId,
  ): Promise<PaginatedVehicles>;
  delete(id: VehicleId): Promise<void>;
}

export const VEHICLE_REPOSITORY = Symbol('VehicleRepository');
