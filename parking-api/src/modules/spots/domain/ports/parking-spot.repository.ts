import { ParkingSpot } from '../entities/parking-spot.entity';
import { SpotId } from '../value-objects/spot-id.vo';

export interface PaginatedSpots {
  data: ParkingSpot[];
  total: number;
}

export interface ParkingSpotRepository {
  save(spot: ParkingSpot): Promise<void>;
  findById(id: SpotId): Promise<ParkingSpot | null>;
  findByCode(code: string): Promise<ParkingSpot | null>;
  findAll(): Promise<ParkingSpot[]>;
  findAllPaginated(
    page: number,
    limit: number,
    includeInactive: boolean,
  ): Promise<PaginatedSpots>;
  delete(id: SpotId): Promise<void>;
}

export const PARKING_SPOT_REPOSITORY = Symbol('ParkingSpotRepository');
