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
import { Role } from '../../users/domain/enums/role.enum';
import { CreateSpotUseCase } from '../application/use-cases/create-spot.use-case';
import { ListSpotsUseCase } from '../application/use-cases/list-spots.use-case';
import { GetSpotUseCase } from '../application/use-cases/get-spot.use-case';
import { UpdateSpotUseCase } from '../application/use-cases/update-spot.use-case';
import { DeleteSpotUseCase } from '../application/use-cases/delete-spot.use-case';
import { CreateSpotRequestDto } from './dtos/create-spot-request.dto';
import { UpdateSpotRequestDto } from './dtos/update-spot-request.dto';
import { ListSpotsQueryDto } from './dtos/list-spots-query.dto';
import {
  PaginatedSpotsResponseDto,
  SpotResponseDto,
} from './dtos/spot-response.dto';

@ApiTags('spots')
@ApiBearerAuth()
@Controller('spots')
export class SpotsController {
  constructor(
    private readonly createSpotUseCase: CreateSpotUseCase,
    private readonly listSpotsUseCase: ListSpotsUseCase,
    private readonly getSpotUseCase: GetSpotUseCase,
    private readonly updateSpotUseCase: UpdateSpotUseCase,
    private readonly deleteSpotUseCase: DeleteSpotUseCase,
  ) {}

  @Roles(Role.Admin)
  @ApiCreatedResponse({ type: SpotResponseDto })
  @Post()
  create(@Body() dto: CreateSpotRequestDto): Promise<SpotResponseDto> {
    return this.createSpotUseCase.execute(dto);
  }

  @ApiOkResponse({ type: PaginatedSpotsResponseDto })
  @Get()
  list(@Query() query: ListSpotsQueryDto): Promise<PaginatedSpotsResponseDto> {
    return this.listSpotsUseCase.execute(query);
  }

  @ApiOkResponse({ type: SpotResponseDto })
  @Get(':id')
  get(@Param('id', ParseUUIDPipe) id: string): Promise<SpotResponseDto> {
    return this.getSpotUseCase.execute(id);
  }

  @Roles(Role.Admin)
  @ApiOkResponse({ type: SpotResponseDto })
  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateSpotRequestDto,
  ): Promise<SpotResponseDto> {
    return this.updateSpotUseCase.execute({ id, ...dto });
  }

  @Roles(Role.Admin)
  @ApiNoContentResponse()
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.deleteSpotUseCase.execute(id);
  }
}
