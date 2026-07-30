import { Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  LOGS_REPOSITORY,
  type LogsRepository,
} from '../../domain/ports/logs.repository';
import { ReservationCreatedEvent } from '../../../reservations/domain/events/reservation-created.event';
import { ReservationCancelledEvent } from '../../../reservations/domain/events/reservation-cancelled.event';
import { UserLoggedInEvent } from '../../../auth/domain/events/user-logged-in.event';
import { UserUpdatedEvent } from '../../../users/domain/events/user-updated.event';

@Injectable()
export class LogsEventListener {
  private readonly logger = new Logger(LogsEventListener.name);

  constructor(@Inject(LOGS_REPOSITORY) private readonly logs: LogsRepository) {}

  private async record(
    action: string,
    actorId: string | null,
    payload: Record<string, unknown>,
  ): Promise<void> {
    try {
      await this.logs.save({
        action,
        actorId,
        payload,
        occurredAt: new Date(),
      });
    } catch (error) {
      this.logger.error(`No se pudo persistir el log '${action}'`, error);
    }
  }

  @OnEvent(ReservationCreatedEvent.NAME)
  async onReservationCreated(event: ReservationCreatedEvent): Promise<void> {
    await this.record(ReservationCreatedEvent.NAME, event.userId, {
      reservationId: event.reservationId,
      vehicleId: event.vehicleId,
      spotId: event.spotId,
      start: event.start,
      end: event.end,
    });
  }

  @OnEvent(ReservationCancelledEvent.NAME)
  async onReservationCancelled(
    event: ReservationCancelledEvent,
  ): Promise<void> {
    await this.record(ReservationCancelledEvent.NAME, event.userId, {
      reservationId: event.reservationId,
      reason: event.reason ?? null,
    });
  }

  @OnEvent(UserLoggedInEvent.NAME)
  async onUserLoggedIn(event: UserLoggedInEvent): Promise<void> {
    await this.record(UserLoggedInEvent.NAME, event.userId, {
      email: event.email,
      success: event.success,
    });
  }

  @OnEvent(UserUpdatedEvent.NAME)
  async onUserUpdated(event: UserUpdatedEvent): Promise<void> {
    await this.record(UserUpdatedEvent.NAME, event.actorId, {
      targetUserId: event.targetUserId,
      changedFields: event.changedFields,
    });
  }
}
