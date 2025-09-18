import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Client } from './client.entity';
import { Role } from './role.entity';
import { DocumentType } from './document-type.entity';

@Entity('usuarios')
@Index('uk_documento', ['tipoDocumentoId', 'numeroDocumento'], { unique: true })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ name: 'password_hash', length: 255 })
  passwordHash: string;

  @Column({ name: 'rol_id' })
  rolId: number;

  @Column({ name: 'tipo_documento_id' })
  tipoDocumentoId: number;

  @Column({ name: 'numero_documento', length: 20 })
  numeroDocumento: string;

  @Column({ length: 100 })
  nombres: string;

  @Column({ length: 100 })
  apellidos: string;

  @Column({ nullable: true, length: 20 })
  telefono: string;

  @Column({ type: 'date', nullable: true, name: 'fecha_nacimiento' })
  fechaNacimiento: Date;

  @Column({ type: 'enum', enum: ['M', 'F', 'O'], default: 'O' })
  genero: 'M' | 'F' | 'O';

  @Column({ nullable: true, name: 'foto_perfil', length: 500 })
  fotoPerfil: string;

  @Column({ default: false, name: 'email_verificado', type: 'tinyint' })
  emailVerificado: boolean;

  @Column({ default: false, name: 'telefono_verificado', type: 'tinyint' })
  telefonoVerificado: boolean;

  @Column({ nullable: true, name: 'token_verificacion', length: 100 })
  tokenVerificacion: string;

  @Column({ nullable: true, name: 'token_recuperacion', length: 100 })
  tokenRecuperacion: string;

  @Column({ type: 'timestamp', nullable: true, name: 'fecha_token_expira' })
  fechaTokenExpira: Date;

  @Column({ default: 0, name: 'intentos_login' })
  intentosLogin: number;

  @Column({ type: 'timestamp', nullable: true, name: 'bloqueado_hasta' })
  bloqueadoHasta: Date;

  @Column({ default: false, name: 'acepta_terminos', type: 'tinyint' })
  aceptaTerminos: boolean;

  @Column({ default: false, name: 'acepta_marketing', type: 'tinyint' })
  aceptaMarketing: boolean;

  @Column({ default: true, name: 'es_activo', type: 'tinyint' })
  esActivo: boolean;

  @Column({ type: 'timestamp', nullable: true, name: 'ultimo_acceso' })
  ultimoAcceso: Date;

  @Column({ nullable: true, name: 'ip_ultimo_acceso', length: 45 })
  ipUltimoAcceso: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Role)
  @JoinColumn({ name: 'rol_id' })
  role: Role;

  @ManyToOne(() => DocumentType)
  @JoinColumn({ name: 'tipo_documento_id' })
  documentType: DocumentType;

  @OneToOne(() => Client, (client) => client.user)
  client: Client;
}
