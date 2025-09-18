import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('tipos_documento')
export class DocumentType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 10 })
  codigo: string;

  @Column({ unique: true, length: 50 })
  nombre: string;

  @Column({ name: 'longitud_minima', default: 8 })
  longitudMinima: number;

  @Column({ name: 'longitud_maxima', default: 11 })
  longitudMaxima: number;

  @Column({ nullable: true, name: 'patron_validacion', length: 100 })
  patronValidacion: string;

  @Column({ default: true, name: 'es_activo', type: 'tinyint' })
  esActivo: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
