import { Inject, Injectable } from '@nestjs/common';
import {
  USER_REPOSITORY,
  type UserRepository,
} from '../../domain/ports/user.repository';

export interface ListUsersInput {
  page: number;
  limit: number;
  includeInactive: boolean;
}

export interface ListUsersOutput {
  data: Array<{ id: string; email: string; role: string; active: boolean }>;
  total: number;
  page: number;
  limit: number;
}

@Injectable()
export class ListUsersUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
  ) {}

  async execute(input: ListUsersInput): Promise<ListUsersOutput> {
    const { data, total } = await this.users.findAllPaginated(
      input.page,
      input.limit,
      input.includeInactive,
    );

    return {
      data: data.map((user) => ({
        id: user.id.value,
        email: user.email.value,
        role: user.getRole(),
        active: user.isActive(),
      })),
      total,
      page: input.page,
      limit: input.limit,
    };
  }
}
