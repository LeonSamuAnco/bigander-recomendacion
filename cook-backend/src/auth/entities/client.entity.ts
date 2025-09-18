import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { ClientPlan } from './client-plan.entity';

@Entity('clientes')
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'usuario_id' })
  usuarioId: number;

  @Column({ name: 'plan_cliente_id', default: 1 })
  planClienteId: number;

  @Column({ type: 'date', name: 'fecha_registro' })
  fechaRegistro: Date;

  @Column({ type: 'date', nullable: true, name: 'fecha_inicio_plan' })
  fechaInicioPlan: Date;

  @Column({ type: 'date', nullable: true, name: 'fecha_fin_plan' })
  fechaFinPlan: Date;

  @Column({
    type: 'longtext',
    nullable: true,
    name: 'preferencias_notificacion',
  })
  preferenciasNotificacion: string; // JSON string

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    name: 'limite_credito',
  })
  limiteCredito: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    name: 'credito_usado',
  })
  creditoUsado: number;

  @Column({ default: 0, name: 'puntos_fidelidad' })
  puntosFidelidad: number;

  @Column({
    type: 'enum',
    enum: ['BRONCE', 'PLATA', 'ORO', 'PLATINO'],
    default: 'BRONCE',
    name: 'nivel_cliente',
  })
  nivelCliente: 'BRONCE' | 'PLATA' | 'ORO' | 'PLATINO';

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0,
    name: 'descuento_personalizado',
  })
  descuentoPersonalizado: number;

  @Column({ type: 'text', nullable: true, name: 'notas_internas' })
  notasInternas: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @OneToOne(() => User, (user) => user.client)
  @JoinColumn({ name: 'usuario_id' })
  user: User;

  @ManyToOne(() => ClientPlan)
  @JoinColumn({ name: 'plan_cliente_id' })
  clientPlan: ClientPlan;
}
