import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import {
  ReservationRepository,
  ReserveSpotParams,
} from '../../domain/ports/reservation.repository';
import { Reservation } from '../../domain/entities/reservation.entity';
import { ReservationId } from '../../domain/value-objects/reservation-id.vo';
import { TimeSlot } from '../../domain/value-objects/time-slot.vo';
import { ReservationStatus } from '../../domain/enums/reservation-status.enum';
import { SpotNotAvailableError } from '../../domain/errors/spot-not-available.error';
import { VehicleAlreadyReservedError } from '../../domain/errors/vehicle-already-reserved.error';
import { SpotId } from '../../../spots/domain/value-objects/spot-id.vo';
import { ParkingSpotOrmEntity } from '../../../spots/infrastructure/persistence/parking-spot.orm-entity';
import { VehicleOrmEntity } from '../../../vehicles/infrastructure/persistence/vehicle.orm-entity';
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

  async findConfirmedActiveAt(instant: Date): Promise<Reservation[]> {
    const list = await this.repo.find({
      where: {
        status: ReservationStatus.Confirmed,
        startTime: LessThanOrEqual(instant),
        endTime: MoreThanOrEqual(instant),
      },
    });
    return list.map((orm) => ReservationMapper.toDomain(orm));
  }

  async reserveSpot(params: ReserveSpotParams): Promise<Reservation> {
    return this.repo.manager.transaction(async (em) => {
      const spotRepo = em.getRepository(ParkingSpotOrmEntity);
      const resRepo = em.getRepository(ReservationOrmEntity);
      const vehicleRepo = em.getRepository(VehicleOrmEntity);

      await vehicleRepo.findOne({
        where: { id: params.vehicleId.value },
        lock: { mode: 'pessimistic_write' },
      });

      const overlapWhere = {
        status: ReservationStatus.Confirmed,
        startTime: LessThan(params.slot.end),
        endTime: MoreThan(params.slot.start),
      };

      const vehicleConflict = await resRepo.findOne({
        where: { ...overlapWhere, vehicleId: params.vehicleId.value },
      });
      if (vehicleConflict) {
        throw new VehicleAlreadyReservedError(params.vehicleId.value);
      }

      const occupied = (await resRepo.find({ where: overlapWhere })).map(
        (r) => r.spotId,
      );
      const tried: string[] = [];

      for (;;) {
        const excluded = [...new Set([...occupied, ...tried])];

        const qb = spotRepo
          .createQueryBuilder('spot')
          .where('spot.active = :active', { active: true });
        if (excluded.length > 0) {
          qb.andWhere('spot.id NOT IN (:...excluded)', { excluded });
        }
        qb.orderBy('spot.code', 'ASC')
          .limit(1)
          .setLock('pessimistic_write')
          .setOnLocked('skip_locked');

        const spot = await qb.getOne();
        if (!spot) {
          throw new SpotNotAvailableError();
        }

        const conflict = await resRepo.findOne({
          where: { ...overlapWhere, spotId: spot.id },
        });
        if (conflict) {
          tried.push(spot.id);
          continue;
        }

        const reservation = Reservation.create({
          userId: params.userId,
          vehicleId: params.vehicleId,
          spotId: SpotId.from(spot.id),
          slot: params.slot,
        });
        reservation.confirm();
        await resRepo.save(ReservationMapper.toPersistence(reservation));
        return reservation;
      }
    });
  }

  async findAll(): Promise<Reservation[]> {
    const list = await this.repo.find();
    return list.map((orm) => ReservationMapper.toDomain(orm));
  }

  async delete(id: ReservationId): Promise<void> {
    await this.repo.delete({ id: id.value });
  }
}
