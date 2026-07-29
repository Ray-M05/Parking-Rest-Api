import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity('parking_spots')
@Index(['code'], { unique: true, where: '"active" = true' })
export class ParkingSpotOrmEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column()
  code!: string;

  @Column({ default: true })
  active!: boolean;
}
