import { Inject, Injectable } from '@nestjs/common';
import {
  RESERVATION_REPOSITORY,
  type ReservationFilters,
  type ReservationRepository,
} from '../../domain/ports/reservation.repository';
import { UserId } from '../../../users/domain/value-objects/user-id.vo';
import { VehicleId } from '../../../vehicles/domain/value-objects/vehicle-id.vo';
import { SpotId } from '../../../spots/domain/value-objects/spot-id.vo';
import { Role } from '../../../users/domain/enums/role.enum';
import { ReservationStatus } from '../../domain/enums/reservation-status.enum';

export interface ListReservationsInput {
  requesterId: string;
  requesterRole: string;
  page: number;
  limit: number;
  userId?: string;
  vehicleId?: string;
  spotId?: string;
  status?: ReservationStatus;
  at?: string;
}

export interface ListReservationsOutput {
  data: Array<{
    id: string;
    spotId: string;
    vehicleId: string;
    userId: string;
    startTime: string;
    endTime: string;
    status: string;
  }>;
  total: number;
  page: number;
  limit: number;
}

@Injectable()
export class ListReservationsUseCase {
  constructor(
    @Inject(RESERVATION_REPOSITORY)
    private readonly reservations: ReservationRepository,
  ) {}

  async execute(input: ListReservationsInput): Promise<ListReservationsOutput> {
    const isAdminOrEmployee =
      (input.requesterRole as Role) === Role.Admin ||
      (input.requesterRole as Role) === Role.Employee;

    const userId = isAdminOrEmployee
      ? input.userId
        ? UserId.from(input.userId)
        : undefined
      : UserId.from(input.requesterId);

    const filters: ReservationFilters = {
      userId,
      vehicleId: input.vehicleId ? VehicleId.from(input.vehicleId) : undefined,
      spotId: input.spotId ? SpotId.from(input.spotId) : undefined,
      status: input.status,
      at: input.at ? new Date(input.at) : undefined,
    };

    const { data, total } = await this.reservations.findPaginated(
      input.page,
      input.limit,
      filters,
    );

    return {
      data: data.map((reservation) => ({
        id: reservation.id.value,
        spotId: reservation.spotId.value,
        vehicleId: reservation.vehicleId.value,
        userId: reservation.userId.value,
        startTime: reservation.slot.start.toISOString(),
        endTime: reservation.slot.end.toISOString(),
        status: reservation.getStatus(),
      })),
      total,
      page: input.page,
      limit: input.limit,
    };
  }
}
