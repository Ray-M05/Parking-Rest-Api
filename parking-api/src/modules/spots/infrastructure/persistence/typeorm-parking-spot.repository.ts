import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ParkingSpotRepository } from '../../domain/ports/parking-spot.repository';
import { ParkingSpot } from '../../domain/entities/parking-spot.entity';
import { SpotId } from '../../domain/value-objects/spot-id.vo';
import { ParkingSpotOrmEntity } from './parking-spot.orm-entity';
import { ParkingSpotMapper } from '../mappers/parking-spot.mapper';

@Injectable()
export class TypeOrmParkingSpotRepository implements ParkingSpotRepository {
  constructor(
    @InjectRepository(ParkingSpotOrmEntity)
    private readonly repo: Repository<ParkingSpotOrmEntity>,
  ) {}

  async save(spot: ParkingSpot): Promise<void> {
    await this.repo.save(ParkingSpotMapper.toPersistence(spot));
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

  async delete(id: SpotId): Promise<void> {
    await this.repo.delete({ id: id.value });
  }
}
