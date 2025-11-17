// dia-api/src/meal/meal.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('meal')
export class Meal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  mealType: string;

  @Column('float')
  carbs: number;

  @Column('float', { nullable: true })
  protein?: number | null;

  @Column('float', { nullable: true })
  fat?: number | null;

  @Column('float', { nullable: true })
  sugar?: number | null;

  // quando a refeição foi feita
  @Column({ type: 'timestamp' })
  eatenAt: Date;

  @Column({ type: 'text', nullable: true })
  notes?: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
