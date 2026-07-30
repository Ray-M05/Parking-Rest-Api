export class UserLoggedInEvent {
  static readonly NAME = 'user.logged_in';

  constructor(
    readonly userId: string | null,
    readonly email: string,
    readonly success: boolean,
  ) {}
}
