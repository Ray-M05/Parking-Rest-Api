import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('reservations')
export class ReservationOrmEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column('uuid')
  userId!: string;

  @Column('uuid')
  vehicleId!: string;

  @Column('uuid')
  spotId!: string;

  @Column({ type: 'timestamptz' })
  startTime!: Date;

  @Column({ type: 'timestamptz' })
  endTime!: Date;

  @Column()
  status!: string;
}
