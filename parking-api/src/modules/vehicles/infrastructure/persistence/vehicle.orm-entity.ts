import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('vehicles')
export class VehicleOrmEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column('uuid')
  ownerId!: string;

  @Column({ unique: true })
  plate!: string;
}
