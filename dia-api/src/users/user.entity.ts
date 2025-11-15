// dia-api/src/users/user.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from './user-role.enum';
import { PatientProfile } from './patient-profile.entity';
import { DoctorProfile } from './doctor-profile.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column({ type: 'text' })
  role: UserRole;

  @Column({ type: 'date', nullable: true })
  dateOfBirth?: string;

  @OneToOne(() => PatientProfile, (p) => p.user, { nullable: true })
  patientProfile?: PatientProfile;

  @OneToOne(() => DoctorProfile, (d) => d.user, { nullable: true })
  doctorProfile?: DoctorProfile;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
