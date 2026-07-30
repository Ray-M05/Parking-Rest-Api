import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LOGS_REPOSITORY } from './domain/ports/logs.repository';
import {
  LogDocument,
  LogSchema,
} from './infrastructure/persistence/log.schema';
import { MongooseLogsRepository } from './infrastructure/persistence/mongoose-logs.repository';
import { LogsEventListener } from './infrastructure/listeners/logs-event.listener';
import { GetLogsUseCase } from './application/use-cases/get-logs.use-case';
import { LogsController } from './presentation/logs.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: LogDocument.name, schema: LogSchema }]),
  ],
  controllers: [LogsController],
  providers: [
    { provide: LOGS_REPOSITORY, useClass: MongooseLogsRepository },
    LogsEventListener,
    GetLogsUseCase,
  ],
})
export class LogsModule {}
