import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum InsulinType {
  BASAL = 'BASAL',
  BOLUS = 'BOLUS',
}

@Entity('insulin_dose')
export class InsulinDose {
  @PrimaryGeneratedColumn()
  id: number;

  // <-- novo: dono da dose
  @Column({ type: 'int' })
  userId: number;

  @Column({ type: 'int' })
  units: number;

  @Column({ type: 'enum', enum: InsulinType })
  type: InsulinType;

  @Column({ type: 'timestamp' })
  appliedAt: Date;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
