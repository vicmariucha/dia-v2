// dia-api/src/glucose/glucose.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class GlucoseMeasurement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  value: number;

  @Column({ type: 'datetime' })
  measuredAt: Date;

  @Column({ type: 'varchar', length: 50 })
  period: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  patient: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
