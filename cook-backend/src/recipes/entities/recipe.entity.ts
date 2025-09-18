import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Ingredient } from './ingredient.entity';

@Entity('recetas')
export class Recipe {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'nombre' })
  title: string;

  @Column({ name: 'descripcion' })
  description: string;

  @Column({ name: 'tiempo_total' })
  time: number;

  @Column({ name: 'porciones' })
  servings: number;

  @Column({ name: 'dificultad_id' })
  difficulty: string;

  @Column({ name: 'imagen_principal' })
  image: string;

  @Column({ name: 'instrucciones', type: 'text', nullable: true })
  preparationSteps: string; // Mapeado desde el campo 'instrucciones' en la base de datos

  @ManyToMany(() => Ingredient)
  @JoinTable({
    name: 'receta_ingredientes',
    joinColumn: { name: 'receta_id', referencedColumnName: 'id' },
    inverseJoinColumn: {
      name: 'ingrediente_maestro_id',
      referencedColumnName: 'id',
    },
  })
  ingredients: Ingredient[];
}
