import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehicleRepository } from '../../domain/ports/vehicle.repository';
import { Vehicle } from '../../domain/entities/vehicle.entity';
import { VehicleId } from '../../domain/value-objects/vehicle-id.vo';
import { Plate } from '../../domain/value-objects/plate.vo';
import { UserId } from '../../../users/domain/value-objects/user-id.vo';
import { VehicleOrmEntity } from './vehicle.orm-entity';
import { VehicleMapper } from '../mappers/vehicle.mapper';

@Injectable()
export class TypeOrmVehicleRepository implements VehicleRepository {
  constructor(
    @InjectRepository(VehicleOrmEntity)
    private readonly repo: Repository<VehicleOrmEntity>,
  ) {}

  async save(vehicle: Vehicle): Promise<void> {
    await this.repo.save(VehicleMapper.toPersistence(vehicle));
  }

  async findById(id: VehicleId): Promise<Vehicle | null> {
    const orm = await this.repo.findOne({ where: { id: id.value } });
    return orm ? VehicleMapper.toDomain(orm) : null;
  }

  async findByPlate(plate: Plate): Promise<Vehicle | null> {
    const orm = await this.repo.findOne({ where: { plate: plate.value } });
    return orm ? VehicleMapper.toDomain(orm) : null;
  }

  async findByOwnerId(ownerId: UserId): Promise<Vehicle[]> {
    const list = await this.repo.find({ where: { ownerId: ownerId.value } });
    return list.map((orm) => VehicleMapper.toDomain(orm));
  }

  async findAll(): Promise<Vehicle[]> {
    const list = await this.repo.find();
    return list.map((orm) => VehicleMapper.toDomain(orm));
  }

  async delete(id: VehicleId): Promise<void> {
    await this.repo.delete({ id: id.value });
  }
}
