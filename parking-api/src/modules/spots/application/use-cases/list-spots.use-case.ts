import { Inject, Injectable } from '@nestjs/common';
import {
  PARKING_SPOT_REPOSITORY,
  type ParkingSpotRepository,
} from '../../domain/ports/parking-spot.repository';

export interface ListSpotsInput {
  page: number;
  limit: number;
  includeInactive: boolean;
}

export interface ListSpotsOutput {
  data: Array<{ id: string; code: string; active: boolean }>;
  total: number;
  page: number;
  limit: number;
}

@Injectable()
export class ListSpotsUseCase {
  constructor(
    @Inject(PARKING_SPOT_REPOSITORY)
    private readonly spots: ParkingSpotRepository,
  ) {}

  async execute(input: ListSpotsInput): Promise<ListSpotsOutput> {
    const { data, total } = await this.spots.findAllPaginated(
      input.page,
      input.limit,
      input.includeInactive,
    );

    return {
      data: data.map((spot) => ({
        id: spot.id.value,
        code: spot.code,
        active: spot.isActive(),
      })),
      total,
      page: input.page,
      limit: input.limit,
    };
  }
}
