// dia-api/src/activity/activity.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('activity')
export class Activity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  // Tipo da atividade: Caminhada, Corrida, Musculação, etc.
  @Column()
  activityType: string;

  // Duração em minutos
  @Column('int')
  durationMinutes: number;

  // Intensidade opcional: leve / moderada / intensa
 @Column({ type: 'varchar', length: 20, nullable: true })
  intensity?: string;

  // Opcional: calorias estimadas
  @Column('float', { nullable: true })
  calories?: number | null;

  // Quando a atividade foi feita
  @Column({ type: 'timestamp' })
  performedAt: Date;

  @Column({ type: 'text', nullable: true })
  notes?: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
