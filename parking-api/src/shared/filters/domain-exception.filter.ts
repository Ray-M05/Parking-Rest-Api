import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { InvalidCredentialsError } from '../../modules/auth/domain/errors/invalid-credentials.error';
import { EmailAlreadyInUseError } from '../../modules/users/domain/errors/email-already-in-use.error';
import { UserNotFoundError } from '../../modules/users/domain/errors/user-not-found.error';
import { InvalidEmailError } from '../../modules/users/domain/errors/invalid-email.error';
import { InvalidUserIdError } from '../../modules/users/domain/errors/invalid-user-id.error';
import { SpotNotAvailableError } from '../../modules/reservations/domain/errors/spot-not-available.error';
import { VehicleAlreadyReservedError } from '../../modules/reservations/domain/errors/vehicle-already-reserved.error';
import { InvalidTimeSlotError } from '../../modules/reservations/domain/errors/invalid-time-slot.error';
import { PastTimeSlotError } from '../../modules/reservations/domain/errors/past-time-slot.error';
import { VehicleNotFoundError } from '../../modules/vehicles/domain/errors/vehicle-not-found.error';
import { VehicleNotOwnedError } from '../../modules/vehicles/domain/errors/vehicle-not-owned.error';
import { PlateAlreadyInUseError } from '../../modules/vehicles/domain/errors/plate-already-in-use.error';
import { VehicleInUseError } from '../../modules/vehicles/domain/errors/vehicle-in-use.error';
import { InvalidVehicleIdError } from '../../modules/vehicles/domain/errors/invalid-vehicle-id.error';
import { InvalidPlateError } from '../../modules/vehicles/domain/errors/invalid-plate.error';
import { SpotNotFoundError } from '../../modules/spots/domain/errors/spot-not-found.error';
import { SpotCodeAlreadyInUseError } from '../../modules/spots/domain/errors/spot-code-already-in-use.error';
import { InvalidSpotIdError } from '../../modules/spots/domain/errors/invalid-spot-id.error';
import { InvalidParkingSpotCodeError } from '../../modules/spots/domain/errors/invalid-parking-spot-code.error';
import { InvalidReservationIdError } from '../../modules/reservations/domain/errors/invalid-reservation-id.error';

type ErrorConstructor = new (...args: never[]) => Error;

const DOMAIN_ERROR_STATUS = new Map<ErrorConstructor, HttpStatus>([
  [InvalidCredentialsError, HttpStatus.UNAUTHORIZED],
  [EmailAlreadyInUseError, HttpStatus.CONFLICT],
  [UserNotFoundError, HttpStatus.NOT_FOUND],
  [InvalidEmailError, HttpStatus.BAD_REQUEST],
  [InvalidUserIdError, HttpStatus.BAD_REQUEST],
  [SpotNotAvailableError, HttpStatus.CONFLICT],
  [VehicleAlreadyReservedError, HttpStatus.CONFLICT],
  [InvalidTimeSlotError, HttpStatus.BAD_REQUEST],
  [PastTimeSlotError, HttpStatus.BAD_REQUEST],
  [VehicleNotFoundError, HttpStatus.NOT_FOUND],
  [VehicleNotOwnedError, HttpStatus.FORBIDDEN],
  [PlateAlreadyInUseError, HttpStatus.CONFLICT],
  [VehicleInUseError, HttpStatus.CONFLICT],
  [InvalidVehicleIdError, HttpStatus.BAD_REQUEST],
  [InvalidPlateError, HttpStatus.BAD_REQUEST],
  [SpotNotFoundError, HttpStatus.NOT_FOUND],
  [SpotCodeAlreadyInUseError, HttpStatus.CONFLICT],
  [InvalidSpotIdError, HttpStatus.BAD_REQUEST],
  [InvalidParkingSpotCodeError, HttpStatus.BAD_REQUEST],
  [InvalidReservationIdError, HttpStatus.BAD_REQUEST],
]);

@Catch()
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const body = exception.getResponse();
      const message =
        typeof body === 'string'
          ? body
          : (body as { message?: unknown }).message;

      response.status(status).json({
        statusCode: status,
        message,
        code: exception.name,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
      return;
    }

    const errorClass = (exception as { constructor: ErrorConstructor })
      ?.constructor;
    const status =
      DOMAIN_ERROR_STATUS.get(errorClass) ?? HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      exception instanceof Error ? exception.message : 'Error inesperado';
    const code = exception instanceof Error ? exception.name : 'UnknownError';

    response.status(status).json({
      statusCode: status,
      message,
      code,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
