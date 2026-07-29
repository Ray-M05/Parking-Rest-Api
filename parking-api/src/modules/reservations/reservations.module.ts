import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationOrmEntity } from './infrastructure/persistence/reservation.orm-entity';
import { RESERVATION_REPOSITORY } from './domain/ports/reservation.repository';
import { TypeOrmReservationRepository } from './infrastructure/persistence/typeorm-reservation.repository';
import { SpotsModule } from '../spots/spots.module';
import { VehiclesModule } from '../vehicles/vehicles.module';
import { ReserveSpotUseCase } from './application/use-cases/reserve-spot.use-case';
import { GetOccupancyUseCase } from './application/use-cases/get-occupancy.use-case';
import { ListAvailableSpotsUseCase } from './application/use-cases/list-available-spots.use-case';
import { ReservationsController } from './presentation/reservations.controller';
import { ParkingController } from './presentation/parking.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReservationOrmEntity]),
    SpotsModule,
    VehiclesModule,
  ],
  controllers: [ReservationsController, ParkingController],
  providers: [
    {
      provide: RESERVATION_REPOSITORY,
      useClass: TypeOrmReservationRepository,
    },
    ReserveSpotUseCase,
    GetOccupancyUseCase,
    ListAvailableSpotsUseCase,
  ],
  exports: [RESERVATION_REPOSITORY],
})
export class ReservationsModule {}
