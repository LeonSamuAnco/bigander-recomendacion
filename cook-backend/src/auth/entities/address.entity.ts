import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('direcciones')
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'usuario_id' })
  usuarioId: number;

  @Column({ name: 'distrito_id' })
  distritoId: number;

  @Column({ type: 'text', name: 'direccion_completa' })
  direccionCompleta: string;

  @Column({ type: 'text', nullable: true })
  referencia: string;

  @Column({ nullable: true, length: 10, name: 'codigo_postal' })
  codigoPostal: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 8,
    nullable: true,
  })
  latitud: number;

  @Column({
    type: 'decimal',
    precision: 11,
    scale: 8,
    nullable: true,
  })
  longitud: number;

  @Column({ default: false, name: 'es_principal', type: 'tinyint' })
  esPrincipal: boolean;

  @Column({
    type: 'enum',
    enum: ['CASA', 'TRABAJO', 'NEGOCIO', 'OTRO'],
    default: 'CASA',
    name: 'tipo_direccion',
  })
  tipoDireccion: 'CASA' | 'TRABAJO' | 'NEGOCIO' | 'OTRO';

  @Column({ nullable: true, length: 100, name: 'nombre_contacto' })
  nombreContacto: string;

  @Column({ nullable: true, length: 20, name: 'telefono_contacto' })
  telefonoContacto: string;

  @Column({ type: 'text', nullable: true, name: 'instrucciones_entrega' })
  instruccionesEntrega: string;

  @Column({ default: true, name: 'es_activo', type: 'tinyint' })
  esActivo: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User)
  @JoinColumn({ name: 'usuario_id' })
  user: User;
}
