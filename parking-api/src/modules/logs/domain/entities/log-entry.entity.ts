export class LogEntry {
  private constructor(
    readonly id: string,
    readonly action: string,
    readonly actorId: string | null,
    readonly payload: Record<string, unknown>,
    readonly occurredAt: Date,
  ) {}

  static reconstitute(
    id: string,
    action: string,
    actorId: string | null,
    payload: Record<string, unknown>,
    occurredAt: Date,
  ): LogEntry {
    return new LogEntry(id, action, actorId, payload, occurredAt);
  }
}
