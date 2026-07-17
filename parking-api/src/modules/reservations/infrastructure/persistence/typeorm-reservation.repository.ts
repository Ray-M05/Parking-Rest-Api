import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, MoreThan, Repository } from 'typeorm';
import { ReservationRepository } from '../../domain/ports/reservation.repository';
import { Reservation } from '../../domain/entities/reservation.entity';
import { ReservationId } from '../../domain/value-objects/reservation-id.vo';
import { TimeSlot } from '../../domain/value-objects/time-slot.vo';
import { ReservationStatus } from '../../domain/enums/reservation-status.enum';
import { ReservationOrmEntity } from './reservation.orm-entity';
import { ReservationMapper } from '../mappers/reservation.mapper';

@Injectable()
export class TypeOrmReservationRepository implements ReservationRepository {
  constructor(
    @InjectRepository(ReservationOrmEntity)
    private readonly repo: Repository<ReservationOrmEntity>,
  ) {}

  async save(reservation: Reservation): Promise<void> {
    await this.repo.save(ReservationMapper.toPersistence(reservation));
  }

  async findById(id: ReservationId): Promise<Reservation | null> {
    const orm = await this.repo.findOne({ where: { id: id.value } });
    return orm ? ReservationMapper.toDomain(orm) : null;
  }

  async findConfirmedOverlapping(slot: TimeSlot): Promise<Reservation[]> {
    const list = await this.repo.find({
      where: {
        status: ReservationStatus.Confirmed,
        startTime: LessThan(slot.end),
        endTime: MoreThan(slot.start),
      },
    });
    return list.map((orm) => ReservationMapper.toDomain(orm));
  }

  async findAll(): Promise<Reservation[]> {
    const list = await this.repo.find();
    return list.map((orm) => ReservationMapper.toDomain(orm));
  }

  async delete(id: ReservationId): Promise<void> {
    await this.repo.delete({ id: id.value });
  }
}
