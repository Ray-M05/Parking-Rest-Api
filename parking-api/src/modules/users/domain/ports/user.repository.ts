import { User } from '../entities/user.entity';
import { UserId } from '../value-objects/user-id.vo';
import { Email } from '../value-objects/email.vo';

export interface PaginatedUsers {
  data: User[];
  total: number;
}

export interface UserRepository {
  save(user: User): Promise<void>;
  findById(id: UserId): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  findAll(): Promise<User[]>;
  findAllPaginated(
    page: number,
    limit: number,
    includeInactive: boolean,
  ): Promise<PaginatedUsers>;
  delete(id: UserId): Promise<void>;
}

export const USER_REPOSITORY = Symbol('UserRepository');
