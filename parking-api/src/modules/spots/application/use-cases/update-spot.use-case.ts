import { Inject, Injectable } from '@nestjs/common';
import {
  PARKING_SPOT_REPOSITORY,
  type ParkingSpotRepository,
} from '../../domain/ports/parking-spot.repository';
import { SpotId } from '../../domain/value-objects/spot-id.vo';
import { SpotNotFoundError } from '../../domain/errors/spot-not-found.error';
import { SpotCodeAlreadyInUseError } from '../../domain/errors/spot-code-already-in-use.error';

export interface UpdateSpotInput {
  id: string;
  code?: string;
  active?: boolean;
}

export interface UpdateSpotOutput {
  id: string;
  code: string;
  active: boolean;
}

@Injectable()
export class UpdateSpotUseCase {
  constructor(
    @Inject(PARKING_SPOT_REPOSITORY)
    private readonly spots: ParkingSpotRepository,
  ) {}

  async execute(input: UpdateSpotInput): Promise<UpdateSpotOutput> {
    const spotId = SpotId.from(input.id);
    const spot = await this.spots.findById(spotId);
    if (!spot) {
      throw new SpotNotFoundError(input.id);
    }

    if (input.code !== undefined) {
      const normalized = input.code.trim().toUpperCase();
      const existing = await this.spots.findByCode(normalized);
      if (existing && existing.isActive() && !existing.id.equals(spot.id)) {
        throw new SpotCodeAlreadyInUseError(input.code);
      }
      spot.changeCode(input.code);
    }

    if (input.active !== undefined) {
      if (input.active) {
        spot.activate();
      } else {
        spot.deactivate();
      }
    }

    await this.spots.save(spot);

    return { id: spot.id.value, code: spot.code, active: spot.isActive() };
  }
}
