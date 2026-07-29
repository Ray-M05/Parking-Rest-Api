import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../auth/presentation/decorators/roles.decorator';
import { Role } from '../../users/domain/enums/role.enum';
import { GetOccupancyUseCase } from '../application/use-cases/get-occupancy.use-case';
import { ListAvailableSpotsUseCase } from '../application/use-cases/list-available-spots.use-case';
import { OccupancyQueryDto } from './dtos/occupancy-query.dto';
import { OccupancyResponseDto } from './dtos/occupancy-response.dto';
import { AvailableSpotsQueryDto } from './dtos/available-spots-query.dto';
import { AvailableSpotResponseDto } from './dtos/available-spots-response.dto';

@ApiTags('parking')
@ApiBearerAuth()
@Controller('parking')
export class ParkingController {
  constructor(
    private readonly getOccupancyUseCase: GetOccupancyUseCase,
    private readonly listAvailableSpotsUseCase: ListAvailableSpotsUseCase,
  ) {}

  @Roles(Role.Employee, Role.Admin)
  @ApiOkResponse({ type: OccupancyResponseDto })
  @Get('occupancy')
  occupancy(@Query() query: OccupancyQueryDto): Promise<OccupancyResponseDto> {
    return this.getOccupancyUseCase.execute(query);
  }

  @Roles(Role.Client, Role.Admin)
  @ApiOkResponse({ type: AvailableSpotResponseDto, isArray: true })
  @Get('spots/available')
  available(
    @Query() query: AvailableSpotsQueryDto,
  ): Promise<AvailableSpotResponseDto[]> {
    return this.listAvailableSpotsUseCase.execute(query);
  }
}
