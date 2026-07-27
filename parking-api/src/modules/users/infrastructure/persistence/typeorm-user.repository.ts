import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  PaginatedUsers,
  UserRepository,
} from '../../domain/ports/user.repository';
import { User } from '../../domain/entities/user.entity';
import { UserId } from '../../domain/value-objects/user-id.vo';
import { Email } from '../../domain/value-objects/email.vo';
import { UserOrmEntity } from './user.orm-entity';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class TypeOrmUserRepository implements UserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repo: Repository<UserOrmEntity>,
  ) {}

  async save(user: User): Promise<void> {
    await this.repo.save(UserMapper.toPersistence(user));
  }

  async findById(id: UserId): Promise<User | null> {
    const orm = await this.repo.findOne({ where: { id: id.value } });
    return orm ? UserMapper.toDomain(orm) : null;
  }

  async findByEmail(email: Email): Promise<User | null> {
    const orm = await this.repo.findOne({ where: { email: email.value } });
    return orm ? UserMapper.toDomain(orm) : null;
  }

  async findAll(): Promise<User[]> {
    const list = await this.repo.find();
    return list.map((orm) => UserMapper.toDomain(orm));
  }

  async findAllPaginated(
    page: number,
    limit: number,
    includeInactive: boolean,
  ): Promise<PaginatedUsers> {
    const [list, total] = await this.repo.findAndCount({
      where: includeInactive ? {} : { active: true },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data: list.map((orm) => UserMapper.toDomain(orm)), total };
  }

  async delete(id: UserId): Promise<void> {
    await this.repo.delete({ id: id.value });
  }
}
