import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
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
import { CreateVehicleUseCase } from '../application/use-cases/create-vehicle.use-case';
import { ListVehiclesUseCase } from '../application/use-cases/list-vehicles.use-case';
import { GetVehicleUseCase } from '../application/use-cases/get-vehicle.use-case';
import { UpdateVehicleUseCase } from '../application/use-cases/update-vehicle.use-case';
import { DeleteVehicleUseCase } from '../application/use-cases/delete-vehicle.use-case';
import { CreateVehicleRequestDto } from './dtos/create-vehicle-request.dto';
import { UpdateVehicleRequestDto } from './dtos/update-vehicle-request.dto';
import { ListVehiclesQueryDto } from './dtos/list-vehicles-query.dto';
import {
  PaginatedVehiclesResponseDto,
  VehicleResponseDto,
} from './dtos/vehicle-response.dto';

@ApiTags('vehicles')
@ApiBearerAuth()
@Controller('vehicles')
export class VehiclesController {
  constructor(
    private readonly createVehicleUseCase: CreateVehicleUseCase,
    private readonly listVehiclesUseCase: ListVehiclesUseCase,
    private readonly getVehicleUseCase: GetVehicleUseCase,
    private readonly updateVehicleUseCase: UpdateVehicleUseCase,
    private readonly deleteVehicleUseCase: DeleteVehicleUseCase,
  ) {}

  @Roles(Role.Client, Role.Admin)
  @ApiCreatedResponse({ type: VehicleResponseDto })
  @Post()
  create(
    @Body() dto: CreateVehicleRequestDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<VehicleResponseDto> {
    return this.createVehicleUseCase.execute({
      requesterId: user.userId,
      requesterRole: user.role,
      plate: dto.plate,
      ownerId: dto.ownerId,
    });
  }

  @Roles(Role.Client, Role.Admin)
  @ApiOkResponse({ type: PaginatedVehiclesResponseDto })
  @Get()
  list(
    @Query() query: ListVehiclesQueryDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<PaginatedVehiclesResponseDto> {
    return this.listVehiclesUseCase.execute({
      requesterId: user.userId,
      requesterRole: user.role,
      page: query.page,
      limit: query.limit,
    });
  }

  @Roles(Role.Client, Role.Admin)
  @ApiOkResponse({ type: VehicleResponseDto })
  @Get(':id')
  get(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<VehicleResponseDto> {
    return this.getVehicleUseCase.execute({
      id,
      requesterId: user.userId,
      requesterRole: user.role,
    });
  }

  @Roles(Role.Client, Role.Admin)
  @ApiOkResponse({ type: VehicleResponseDto })
  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateVehicleRequestDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<VehicleResponseDto> {
    return this.updateVehicleUseCase.execute({
      id,
      requesterId: user.userId,
      requesterRole: user.role,
      plate: dto.plate,
    });
  }

  @Roles(Role.Client, Role.Admin)
  @ApiNoContentResponse()
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<void> {
    return this.deleteVehicleUseCase.execute({
      id,
      requesterId: user.userId,
      requesterRole: user.role,
    });
  }
}
