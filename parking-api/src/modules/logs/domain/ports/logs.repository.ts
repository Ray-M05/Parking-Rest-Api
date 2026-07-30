import { LogEntry } from '../entities/log-entry.entity';

export interface SaveLogParams {
  action: string;
  actorId: string | null;
  payload: Record<string, unknown>;
  occurredAt: Date;
}

export interface LogFilters {
  action?: string;
  actorId?: string;
  from?: Date;
  to?: Date;
}

export interface PaginatedLogs {
  data: LogEntry[];
  total: number;
}

export interface LogsRepository {
  save(params: SaveLogParams): Promise<void>;
  findPaginated(
    page: number,
    limit: number,
    filters?: LogFilters,
  ): Promise<PaginatedLogs>;
}

export const LOGS_REPOSITORY = Symbol('LogsRepository');
