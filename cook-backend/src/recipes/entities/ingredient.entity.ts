import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('ingredientes_maestros')
export class Ingredient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'nombre' })
  nombre: string;
}
