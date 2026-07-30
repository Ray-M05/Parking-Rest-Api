import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../../auth/presentation/decorators/roles.decorator';
import { CurrentUser } from '../../auth/presentation/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../auth/infrastructure/strategies/jwt.strategy';
import { Role } from '../../users/domain/enums/role.enum';
import { ReserveSpotUseCase } from '../application/use-cases/reserve-spot.use-case';
import { ListReservationsUseCase } from '../application/use-cases/list-reservations.use-case';
import { GetReservationUseCase } from '../application/use-cases/get-reservation.use-case';
import { CancelReservationUseCase } from '../application/use-cases/cancel-reservation.use-case';
import { DeleteReservationUseCase } from '../application/use-cases/delete-reservation.use-case';
import { CreateReservationRequestDto } from './dtos/create-reservation-request.dto';
import { ReservationResponseDto } from './dtos/reservation-response.dto';
import { ListReservationsQueryDto } from './dtos/list-reservations-query.dto';
import { PaginatedReservationsResponseDto } from './dtos/paginated-reservations-response.dto';
import { CancelReservationRequestDto } from './dtos/cancel-reservation-request.dto';

@ApiTags('reservations')
@ApiBearerAuth()
@Controller('reservations')
export class ReservationsController {
  constructor(
    private readonly reserveSpotUseCase: ReserveSpotUseCase,
    private readonly listReservationsUseCase: ListReservationsUseCase,
    private readonly getReservationUseCase: GetReservationUseCase,
    private readonly cancelReservationUseCase: CancelReservationUseCase,
    private readonly deleteReservationUseCase: DeleteReservationUseCase,
  ) {}

  @Roles(Role.Client, Role.Admin)
  @ApiCreatedResponse({ type: ReservationResponseDto })
  @Post()
  reserve(
    @Body() dto: CreateReservationRequestDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ReservationResponseDto> {
    return this.reserveSpotUseCase.execute({
      userId: user.userId,
      role: user.role,
      vehicleId: dto.vehicleId,
      startTime: dto.startTime,
      endTime: dto.endTime,
    });
  }

  @ApiOkResponse({ type: PaginatedReservationsResponseDto })
  @Get()
  list(
    @Query() query: ListReservationsQueryDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<PaginatedReservationsResponseDto> {
    return this.listReservationsUseCase.execute({
      requesterId: user.userId,
      requesterRole: user.role,
      page: query.page,
      limit: query.limit,
      userId: query.userId,
      vehicleId: query.vehicleId,
      spotId: query.spotId,
      status: query.status,
      at: query.at,
    });
  }

  @ApiOkResponse({ type: ReservationResponseDto })
  @Get(':id')
  get(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ReservationResponseDto> {
    return this.getReservationUseCase.execute({
      id,
      requesterId: user.userId,
      requesterRole: user.role,
    });
  }

  @Roles(Role.Client, Role.Admin)
  @ApiOkResponse({ type: ReservationResponseDto })
  @Patch(':id/cancel')
  cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CancelReservationRequestDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ReservationResponseDto> {
    return this.cancelReservationUseCase.execute({
      id,
      requesterId: user.userId,
      requesterRole: user.role,
      reason: dto.reason,
    });
  }

  @Roles(Role.Admin)
  @ApiNoContentResponse()
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.deleteReservationUseCase.execute({ id });
  }
}
