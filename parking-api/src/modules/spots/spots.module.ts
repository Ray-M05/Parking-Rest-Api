import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParkingSpotOrmEntity } from './infrastructure/persistence/parking-spot.orm-entity';
import { PARKING_SPOT_REPOSITORY } from './domain/ports/parking-spot.repository';
import { TypeOrmParkingSpotRepository } from './infrastructure/persistence/typeorm-parking-spot.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ParkingSpotOrmEntity])],
  providers: [
    {
      provide: PARKING_SPOT_REPOSITORY,
      useClass: TypeOrmParkingSpotRepository,
    },
  ],
  exports: [PARKING_SPOT_REPOSITORY],
})
export class SpotsModule {}
