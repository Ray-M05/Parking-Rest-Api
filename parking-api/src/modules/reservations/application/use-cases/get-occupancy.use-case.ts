import { Inject, Injectable } from '@nestjs/common';
import {
  PARKING_SPOT_REPOSITORY,
  type ParkingSpotRepository,
} from '../../../spots/domain/ports/parking-spot.repository';
import {
  RESERVATION_REPOSITORY,
  type ReservationRepository,
} from '../../domain/ports/reservation.repository';

export interface GetOccupancyInput {
  at?: string;
}

export interface GetOccupancyOutput {
  total: number;
  occupied: number;
  available: number;
  occupancyRate: number;
  generatedAt: string;
}

@Injectable()
export class GetOccupancyUseCase {
  constructor(
    @Inject(PARKING_SPOT_REPOSITORY)
    private readonly spots: ParkingSpotRepository,
    @Inject(RESERVATION_REPOSITORY)
    private readonly reservations: ReservationRepository,
  ) {}

  async execute(input: GetOccupancyInput): Promise<GetOccupancyOutput> {
    const instant = input.at ? new Date(input.at) : new Date();

    const [allSpots, active] = await Promise.all([
      this.spots.findAll(),
      this.reservations.findConfirmedActiveAt(instant),
    ]);

    const total = allSpots.filter((spot) => spot.isActive()).length;
    const occupied = new Set(active.map((r) => r.spotId.value)).size;
    const available = Math.max(total - occupied, 0);
    const occupancyRate = total > 0 ? occupied / total : 0;

    return {
      total,
      occupied,
      available,
      occupancyRate: Math.round(occupancyRate * 100) / 100,
      generatedAt: instant.toISOString(),
    };
  }
}
