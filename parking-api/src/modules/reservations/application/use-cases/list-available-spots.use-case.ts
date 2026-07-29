import { Inject, Injectable } from '@nestjs/common';
import {
  PARKING_SPOT_REPOSITORY,
  type ParkingSpotRepository,
} from '../../../spots/domain/ports/parking-spot.repository';
import {
  RESERVATION_REPOSITORY,
  type ReservationRepository,
} from '../../domain/ports/reservation.repository';
import { TimeSlot } from '../../domain/value-objects/time-slot.vo';
import { FreeSpotSelector } from '../../domain/services/free-spot-selector';

export interface ListAvailableSpotsInput {
  start: string;
  end: string;
}

export interface AvailableSpotOutput {
  id: string;
  code: string;
}

@Injectable()
export class ListAvailableSpotsUseCase {
  constructor(
    @Inject(PARKING_SPOT_REPOSITORY)
    private readonly spots: ParkingSpotRepository,
    @Inject(RESERVATION_REPOSITORY)
    private readonly reservations: ReservationRepository,
  ) {}

  async execute(
    input: ListAvailableSpotsInput,
  ): Promise<AvailableSpotOutput[]> {
    const slot = new TimeSlot(new Date(input.start), new Date(input.end));

    const [spots, overlapping] = await Promise.all([
      this.spots.findAll(),
      this.reservations.findConfirmedOverlapping(slot),
    ]);

    return FreeSpotSelector.freeSpots(spots, overlapping).map((spot) => ({
      id: spot.id.value,
      code: spot.code,
    }));
  }
}
