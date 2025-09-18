import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 20 })
  codigo: string;

  @Column({ unique: true, length: 50 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'longtext', nullable: true })
  permisos: string; // JSON string

  @Column({ default: true, name: 'es_activo', type: 'tinyint' })
  esActivo: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
