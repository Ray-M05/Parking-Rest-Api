import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleOrmEntity } from './infrastructure/persistence/vehicle.orm-entity';
import { VEHICLE_REPOSITORY } from './domain/ports/vehicle.repository';
import { TypeOrmVehicleRepository } from './infrastructure/persistence/typeorm-vehicle.repository';
import { UsersModule } from '../users/users.module';
import { VehiclesController } from './presentation/vehicles.controller';
import { CreateVehicleUseCase } from './application/use-cases/create-vehicle.use-case';
import { ListVehiclesUseCase } from './application/use-cases/list-vehicles.use-case';
import { GetVehicleUseCase } from './application/use-cases/get-vehicle.use-case';
import { UpdateVehicleUseCase } from './application/use-cases/update-vehicle.use-case';
import { DeleteVehicleUseCase } from './application/use-cases/delete-vehicle.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([VehicleOrmEntity]), UsersModule],
  controllers: [VehiclesController],
  providers: [
    {
      provide: VEHICLE_REPOSITORY,
      useClass: TypeOrmVehicleRepository,
    },
    CreateVehicleUseCase,
    ListVehiclesUseCase,
    GetVehicleUseCase,
    UpdateVehicleUseCase,
    DeleteVehicleUseCase,
  ],
  exports: [VEHICLE_REPOSITORY],
})
export class VehiclesModule {}
