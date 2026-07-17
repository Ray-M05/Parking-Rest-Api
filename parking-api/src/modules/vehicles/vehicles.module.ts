import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleOrmEntity } from './infrastructure/persistence/vehicle.orm-entity';
import { VEHICLE_REPOSITORY } from './domain/ports/vehicle.repository';
import { TypeOrmVehicleRepository } from './infrastructure/persistence/typeorm-vehicle.repository';

@Module({
  imports: [TypeOrmModule.forFeature([VehicleOrmEntity])],
  providers: [
    {
      provide: VEHICLE_REPOSITORY,
      useClass: TypeOrmVehicleRepository,
    },
  ],
  exports: [VEHICLE_REPOSITORY],
})
export class VehiclesModule {}
