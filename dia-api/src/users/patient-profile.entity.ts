import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class PatientProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.patientProfile, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column()
  diabetesType: string; // 'Tipo 1' | 'Tipo 2' | gestacional etc.

  @Column({ type: 'date', nullable: true })
  diagnosisDate?: string;

  @Column()
  treatment: string; // 'Insulina', 'Medicação oral', etc.

  @Column({ nullable: true })
  glucoseChecksPerDay?: string;

  @Column({ default: false })
  usesInsulin: boolean;

  @Column({ nullable: true })
  bolusInsulin?: string;

  @Column({ nullable: true })
  basalInsulin?: string;
}
