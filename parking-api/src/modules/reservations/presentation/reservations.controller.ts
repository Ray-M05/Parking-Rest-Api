import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../auth/presentation/decorators/roles.decorator';
import { CurrentUser } from '../../auth/presentation/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../auth/infrastructure/strategies/jwt.strategy';
import { Role } from '../../users/domain/enums/role.enum';
import { ReserveSpotUseCase } from '../application/use-cases/reserve-spot.use-case';
import { CreateReservationRequestDto } from './dtos/create-reservation-request.dto';
import { ReservationResponseDto } from './dtos/reservation-response.dto';

@ApiTags('reservations')
@ApiBearerAuth()
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reserveSpotUseCase: ReserveSpotUseCase) {}

  @Roles(Role.Client, Role.Admin)
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
}
