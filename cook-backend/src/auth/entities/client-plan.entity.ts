import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('planes_cliente')
export class ClientPlan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 20 })
  codigo: string;

  @Column({ length: 50 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({
    type: 'decimal',
    precision: 8,
    scale: 2,
    default: 0,
    name: 'precio_mensual',
  })
  precioMensual: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    name: 'precio_anual',
  })
  precioAnual: number;

  @Column({ default: false, name: 'incluye_recetas', type: 'tinyint' })
  incluyeRecetas: boolean;

  @Column({ default: 0, name: 'limite_ingredientes' })
  limiteIngredientes: number;

  @Column({ default: 0, name: 'limite_recetas_favoritas' })
  limiteRecetasFavoritas: number;

  @Column({
    type: 'longtext',
    nullable: true,
  })
  funcionalidades: string; // JSON string

  @Column({ default: true, name: 'es_activo', type: 'tinyint' })
  esActivo: boolean;

  @Column({ default: 1, name: 'orden_mostrar' })
  ordenMostrar: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
