export class UserUpdatedEvent {
  static readonly NAME = 'user.updated';

  constructor(
    readonly actorId: string,
    readonly targetUserId: string,
    readonly changedFields: string[],
  ) {}
}
