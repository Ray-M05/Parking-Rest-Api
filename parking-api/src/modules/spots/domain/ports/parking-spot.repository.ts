import { ParkingSpot } from '../entities/parking-spot.entity';
import { SpotId } from '../value-objects/spot-id.vo';

export interface ParkingSpotRepository {
  save(spot: ParkingSpot): Promise<void>;
  findById(id: SpotId): Promise<ParkingSpot | null>;
  findByCode(code: string): Promise<ParkingSpot | null>;
  findAll(): Promise<ParkingSpot[]>;
  delete(id: SpotId): Promise<void>;
}

export const PARKING_SPOT_REPOSITORY = Symbol('ParkingSpotRepository');
