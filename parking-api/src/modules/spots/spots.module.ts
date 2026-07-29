import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParkingSpotOrmEntity } from './infrastructure/persistence/parking-spot.orm-entity';
import { PARKING_SPOT_REPOSITORY } from './domain/ports/parking-spot.repository';
import { TypeOrmParkingSpotRepository } from './infrastructure/persistence/typeorm-parking-spot.repository';
import { SpotsController } from './presentation/spots.controller';
import { CreateSpotUseCase } from './application/use-cases/create-spot.use-case';
import { ListSpotsUseCase } from './application/use-cases/list-spots.use-case';
import { GetSpotUseCase } from './application/use-cases/get-spot.use-case';
import { UpdateSpotUseCase } from './application/use-cases/update-spot.use-case';
import { DeleteSpotUseCase } from './application/use-cases/delete-spot.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([ParkingSpotOrmEntity])],
  controllers: [SpotsController],
  providers: [
    {
      provide: PARKING_SPOT_REPOSITORY,
      useClass: TypeOrmParkingSpotRepository,
    },
    CreateSpotUseCase,
    ListSpotsUseCase,
    GetSpotUseCase,
    UpdateSpotUseCase,
    DeleteSpotUseCase,
  ],
  exports: [PARKING_SPOT_REPOSITORY],
})
export class SpotsModule {}
