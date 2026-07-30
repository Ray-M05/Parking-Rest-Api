import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../auth/presentation/decorators/roles.decorator';
import { Role } from '../../users/domain/enums/role.enum';
import { GetLogsUseCase } from '../application/use-cases/get-logs.use-case';
import { ListLogsQueryDto } from './dtos/list-logs-query.dto';
import { PaginatedLogsResponseDto } from './dtos/paginated-logs-response.dto';

@ApiTags('logs')
@ApiBearerAuth()
@Controller('logs')
export class LogsController {
  constructor(private readonly getLogsUseCase: GetLogsUseCase) {}

  @Roles(Role.Admin)
  @ApiOkResponse({ type: PaginatedLogsResponseDto })
  @Get()
  list(@Query() query: ListLogsQueryDto): Promise<PaginatedLogsResponseDto> {
    return this.getLogsUseCase.execute({
      page: query.page,
      limit: query.limit,
      action: query.action,
      actorId: query.actorId,
      from: query.from,
      to: query.to,
    });
  }
}
