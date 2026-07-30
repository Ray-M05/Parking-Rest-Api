import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  LogFilters,
  LogsRepository,
  PaginatedLogs,
  SaveLogParams,
} from '../../domain/ports/logs.repository';
import { LogDocument } from './log.schema';
import { LogMapper } from '../mappers/log.mapper';

@Injectable()
export class MongooseLogsRepository implements LogsRepository {
  constructor(
    @InjectModel(LogDocument.name)
    private readonly model: Model<LogDocument>,
  ) {}

  async save(params: SaveLogParams): Promise<void> {
    await this.model.create(params);
  }

  async findPaginated(
    page: number,
    limit: number,
    filters?: LogFilters,
  ): Promise<PaginatedLogs> {
    const query: Record<string, unknown> = {};

    if (filters?.action) {
      query.action = filters.action;
    }
    if (filters?.actorId) {
      query.actorId = filters.actorId;
    }
    if (filters?.from || filters?.to) {
      const range: Record<string, Date> = {};
      if (filters.from) {
        range.$gte = filters.from;
      }
      if (filters.to) {
        range.$lte = filters.to;
      }
      query.occurredAt = range;
    }

    const [docs, total] = await Promise.all([
      this.model
        .find(query)
        .sort({ occurredAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.model.countDocuments(query).exec(),
    ]);

    return {
      data: docs.map((doc) => LogMapper.toDomain(doc)),
      total,
    };
  }
}
