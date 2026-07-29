import { ParkingSpot } from '../../../spots/domain/entities/parking-spot.entity';
import { Reservation } from '../entities/reservation.entity';

export class FreeSpotSelector {
  static freeSpots(
    activeSpots: ParkingSpot[],
    overlapping: Reservation[],
  ): ParkingSpot[] {
    const occupied = new Set(overlapping.map((r) => r.spotId.value));
    return activeSpots
      .filter((spot) => spot.isActive() && !occupied.has(spot.id.value))
      .sort((a, b) => a.code.localeCompare(b.code));
  }
}
