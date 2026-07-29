import { Inject, Injectable } from '@nestjs/common';
import {
  RESERVATION_REPOSITORY,
  type ReservationRepository,
} from '../../domain/ports/reservation.repository';
import { UserId } from '../../../users/domain/value-objects/user-id.vo';
import { Role } from '../../../users/domain/enums/role.enum';

export interface ListReservationsInput {
  requesterId: string;
  requesterRole: string;
  page: number;
  limit: number;
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
      ? undefined
      : UserId.from(input.requesterId);

    const { data, total } = await this.reservations.findPaginated(
      input.page,
      input.limit,
      userId,
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
