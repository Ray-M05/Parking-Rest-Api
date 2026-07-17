import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { UserOrmEntity } from '../../../users/infrastructure/persistence/user.orm-entity';
import { VehicleOrmEntity } from '../../../vehicles/infrastructure/persistence/vehicle.orm-entity';
import { ParkingSpotOrmEntity } from '../../../spots/infrastructure/persistence/parking-spot.orm-entity';

@Entity('reservations')
export class ReservationOrmEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @ManyToOne(() => UserOrmEntity)
  @JoinColumn({ name: 'userId' })
  user!: UserOrmEntity;

  @Column({ name: 'userId' })
  userId!: string;

  @ManyToOne(() => VehicleOrmEntity)
  @JoinColumn({ name: 'vehicleId' })
  vehicle!: VehicleOrmEntity;

  @Column({ name: 'vehicleId' })
  vehicleId!: string;

  @ManyToOne(() => ParkingSpotOrmEntity)
  @JoinColumn({ name: 'spotId' })
  spot!: ParkingSpotOrmEntity;

  @Column({ name: 'spotId' })
  spotId!: string;

  @Column({ type: 'timestamptz' })
  startTime!: Date;

  @Column({ type: 'timestamptz' })
  endTime!: Date;

  @Column()
  status!: string;
}
