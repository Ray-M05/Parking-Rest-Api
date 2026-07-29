import { Inject, Injectable } from '@nestjs/common';
import {
  PARKING_SPOT_REPOSITORY,
  type ParkingSpotRepository,
} from '../../domain/ports/parking-spot.repository';
import { SpotId } from '../../domain/value-objects/spot-id.vo';
import { SpotNotFoundError } from '../../domain/errors/spot-not-found.error';

export interface GetSpotOutput {
  id: string;
  code: string;
  active: boolean;
}

@Injectable()
export class GetSpotUseCase {
  constructor(
    @Inject(PARKING_SPOT_REPOSITORY)
    private readonly spots: ParkingSpotRepository,
  ) {}

  async execute(id: string): Promise<GetSpotOutput> {
    const spot = await this.spots.findById(SpotId.from(id));
    if (!spot) {
      throw new SpotNotFoundError(id);
    }
    return { id: spot.id.value, code: spot.code, active: spot.isActive() };
  }
}
