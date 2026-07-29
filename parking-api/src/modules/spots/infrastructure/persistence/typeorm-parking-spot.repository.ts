import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import {
  ParkingSpotRepository,
  PaginatedSpots,
} from '../../domain/ports/parking-spot.repository';
import { ParkingSpot } from '../../domain/entities/parking-spot.entity';
import { SpotId } from '../../domain/value-objects/spot-id.vo';
import { SpotCodeAlreadyInUseError } from '../../domain/errors/spot-code-already-in-use.error';
import { ParkingSpotOrmEntity } from './parking-spot.orm-entity';
import { ParkingSpotMapper } from '../mappers/parking-spot.mapper';

const UNIQUE_VIOLATION = '23505';

@Injectable()
export class TypeOrmParkingSpotRepository implements ParkingSpotRepository {
  constructor(
    @InjectRepository(ParkingSpotOrmEntity)
    private readonly repo: Repository<ParkingSpotOrmEntity>,
  ) {}

  async save(spot: ParkingSpot): Promise<void> {
    try {
      await this.repo.save(ParkingSpotMapper.toPersistence(spot));
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error as unknown as { code?: string }).code === UNIQUE_VIOLATION
      ) {
        throw new SpotCodeAlreadyInUseError(spot.code);
      }
      throw error;
    }
  }

  async findById(id: SpotId): Promise<ParkingSpot | null> {
    const orm = await this.repo.findOne({ where: { id: id.value } });
    return orm ? ParkingSpotMapper.toDomain(orm) : null;
  }

  async findByCode(code: string): Promise<ParkingSpot | null> {
    const orm = await this.repo.findOne({ where: { code } });
    return orm ? ParkingSpotMapper.toDomain(orm) : null;
  }

  async findAll(): Promise<ParkingSpot[]> {
    const list = await this.repo.find();
    return list.map((orm) => ParkingSpotMapper.toDomain(orm));
  }

  async findAllPaginated(
    page: number,
    limit: number,
    includeInactive: boolean,
  ): Promise<PaginatedSpots> {
    const [list, total] = await this.repo.findAndCount({
      where: includeInactive ? {} : { active: true },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data: list.map((orm) => ParkingSpotMapper.toDomain(orm)), total };
  }

  async delete(id: SpotId): Promise<void> {
    await this.repo.delete({ id: id.value });
  }
}
