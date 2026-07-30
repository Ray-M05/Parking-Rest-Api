import { Inject, Injectable } from '@nestjs/common';
import {
  LOGS_REPOSITORY,
  type LogFilters,
  type LogsRepository,
} from '../../domain/ports/logs.repository';

export interface GetLogsInput {
  page: number;
  limit: number;
  action?: string;
  actorId?: string;
  from?: string;
  to?: string;
}

export interface GetLogsOutput {
  data: Array<{
    id: string;
    action: string;
    actorId: string | null;
    payload: Record<string, unknown>;
    occurredAt: string;
  }>;
  total: number;
  page: number;
  limit: number;
}

@Injectable()
export class GetLogsUseCase {
  constructor(
    @Inject(LOGS_REPOSITORY)
    private readonly logs: LogsRepository,
  ) {}

  async execute(input: GetLogsInput): Promise<GetLogsOutput> {
    const filters: LogFilters = {
      action: input.action,
      actorId: input.actorId,
      from: input.from ? new Date(input.from) : undefined,
      to: input.to ? new Date(input.to) : undefined,
    };

    const { data, total } = await this.logs.findPaginated(
      input.page,
      input.limit,
      filters,
    );

    return {
      data: data.map((log) => ({
        id: log.id,
        action: log.action,
        actorId: log.actorId,
        payload: log.payload,
        occurredAt: log.occurredAt.toISOString(),
      })),
      total,
      page: input.page,
      limit: input.limit,
    };
  }
}
