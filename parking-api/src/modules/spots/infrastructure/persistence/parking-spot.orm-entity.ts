import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('parking_spots')
export class ParkingSpotOrmEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ unique: true })
  code!: string;

  @Column({ default: true })
  active!: boolean;
}
