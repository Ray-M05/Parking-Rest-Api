import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationOrmEntity } from './infrastructure/persistence/reservation.orm-entity';
import { RESERVATION_REPOSITORY } from './domain/ports/reservation.repository';
import { TypeOrmReservationRepository } from './infrastructure/persistence/typeorm-reservation.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ReservationOrmEntity])],
  providers: [
    {
      provide: RESERVATION_REPOSITORY,
      useClass: TypeOrmReservationRepository,
    },
  ],
  exports: [RESERVATION_REPOSITORY],
})
export class ReservationsModule {}
