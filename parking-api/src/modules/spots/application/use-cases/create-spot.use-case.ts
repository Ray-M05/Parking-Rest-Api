import { Inject, Injectable } from '@nestjs/common';
import {
  PARKING_SPOT_REPOSITORY,
  type ParkingSpotRepository,
} from '../../domain/ports/parking-spot.repository';
import { ParkingSpot } from '../../domain/entities/parking-spot.entity';
import { SpotCodeAlreadyInUseError } from '../../domain/errors/spot-code-already-in-use.error';

export interface CreateSpotInput {
  code: string;
}

export interface CreateSpotOutput {
  id: string;
  code: string;
  active: boolean;
}

@Injectable()
export class CreateSpotUseCase {
  constructor(
    @Inject(PARKING_SPOT_REPOSITORY)
    private readonly spots: ParkingSpotRepository,
  ) {}

  async execute(input: CreateSpotInput): Promise<CreateSpotOutput> {
    const existing = await this.spots.findByCode(
      input.code.trim().toUpperCase(),
    );

    if (existing) {
      if (existing.isActive()) {
        throw new SpotCodeAlreadyInUseError(input.code);
      }
      existing.activate();
      await this.spots.save(existing);
      return {
        id: existing.id.value,
        code: existing.code,
        active: existing.isActive(),
      };
    }

    const spot = ParkingSpot.create(input.code);
    await this.spots.save(spot);

    return { id: spot.id.value, code: spot.code, active: spot.isActive() };
  }
}
