import { LogEntry } from '../../domain/entities/log-entry.entity';
import { LogHydratedDocument } from '../persistence/log.schema';

export class LogMapper {
  static toDomain(doc: LogHydratedDocument): LogEntry {
    return LogEntry.reconstitute(
      doc._id.toString(),
      doc.action,
      doc.actorId,
      doc.payload,
      doc.occurredAt,
    );
  }
}
