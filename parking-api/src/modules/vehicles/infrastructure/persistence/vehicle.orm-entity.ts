import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { UserOrmEntity } from '../../../users/infrastructure/persistence/user.orm-entity';

@Entity('vehicles')
export class VehicleOrmEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @ManyToOne(() => UserOrmEntity)
  @JoinColumn({ name: 'ownerId' })
  owner!: UserOrmEntity;

  @Column({ name: 'ownerId' })
  ownerId!: string;

  @Column({ unique: true })
  plate!: string;
}
