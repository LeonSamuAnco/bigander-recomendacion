import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  InternalServerErrorException,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { DocumentType } from './entities/document-type.entity';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    @InjectRepository(DocumentType)
    private documentTypesRepository: Repository<DocumentType>,
    private jwtService: JwtService,
    private dataSource: DataSource, // Para transacciones
  ) {}

  async register(registerUserDto: RegisterUserDto) {
    const {
      email,
      password,
      rolId,
      tipoDocumentoId,
      numeroDocumento,
      nombres,
      apellidos,
      telefono,
      fechaNacimiento,
      genero,
      aceptaTerminos,
      aceptaMarketing,
    } = registerUserDto;

    // Verificar si el email ya existe
    const existingUser = await this.usersRepository.findOneBy({ email });
    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está en uso');
    }

    // Verificar si el documento ya existe
    const existingDocument = await this.usersRepository.findOneBy({
      tipoDocumentoId,
      numeroDocumento,
    });
    if (existingDocument) {
      throw new ConflictException('El número de documento ya está registrado');
    }

    // Verificar si se intenta registrar un administrador y ya existe uno
    if (rolId === 3) { // Asumiendo que rolId 3 es ADMIN
      const existingAdmin = await this.usersRepository.findOne({
        where: { rolId: 3 },
        relations: ['role'],
      });
      
      if (existingAdmin) {
        throw new ConflictException('Ya existe un administrador registrado en el sistema. Solo se permite un administrador por sistema.');
      }
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // El campo id ya tiene AUTO_INCREMENT configurado

      // Usar SQL directo para insertar el usuario sin especificar id
      const insertUserResult: any = await queryRunner.manager.query(
          `INSERT INTO usuarios (
          email, password_hash, rol_id, tipo_documento_id, numero_documento, 
          nombres, apellidos, telefono, fecha_nacimiento, genero, 
          acepta_terminos, acepta_marketing, email_verificado, telefono_verificado, 
          es_activo, intentos_login, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          email,
          hashedPassword,
          rolId || 1,
          tipoDocumentoId,
          numeroDocumento,
          nombres,
          apellidos,
          telefono || null,
          fechaNacimiento ? new Date(fechaNacimiento) : null,
          genero || 'O',
          aceptaTerminos || false,
          aceptaMarketing || false,
          false, // email_verificado
          false, // telefono_verificado
          true, // es_activo
          0, // intentos_login
        ],
      );

      const userId: number = insertUserResult.insertId;

      // Obtener el usuario creado
      const savedUser = await queryRunner.manager.findOne(User, {
        where: { id: userId },
      });

      if (!savedUser) {
        throw new InternalServerErrorException('Error al crear el usuario');
      }

      // Solo crear cliente si el rol es Cliente (rolId = 1)
      if (rolId === 1 || !rolId) {
        // El campo id de clientes ya tiene AUTO_INCREMENT configurado

        // Usar SQL directo para insertar el cliente también
        await queryRunner.manager.query(
          `INSERT INTO clientes (
            usuario_id, plan_cliente_id, fecha_registro, puntos_fidelidad, 
            nivel_cliente, limite_credito, credito_usado, descuento_personalizado,
            created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [
            savedUser.id,
            1, // Plan básico por defecto
            new Date(),
            0, // puntos_fidelidad
            'BRONCE', // nivel_cliente
            0, // limite_credito
            0, // credito_usado
            0, // descuento_personalizado
          ],
        );
      }

      await queryRunner.commitTransaction();

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash, ...userResult } = savedUser;
      return {
        ...userResult,
        message: 'Usuario registrado exitosamente',
      };
    } catch (error: any) {
      await queryRunner.rollbackTransaction();
      console.error('Error en registro:', error);

      // Manejo específico de errores de base de datos
      if (error.code === 'ER_DUP_ENTRY') {
        if (error.message.includes('email')) {
          throw new ConflictException('El correo electrónico ya está en uso');
        }
        if (error.message.includes('uk_documento')) {
          throw new ConflictException(
            'El número de documento ya está registrado',
          );
        }
      }

      throw new InternalServerErrorException(
        `Error al crear el usuario: ${error.message}`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.usersRepository.findOneBy({ email });

    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      const payload = { sub: user.id, email: user.email, rol: user.rolId };
      return {
        access_token: this.jwtService.sign(payload),
        user: {
          id: user.id,
          nombres: user.nombres,
          apellidos: user.apellidos,
          email: user.email,
        },
      };
    }

    throw new UnauthorizedException('Credenciales incorrectas');
  }

  async getRoles(): Promise<Role[]> {
    return this.rolesRepository.find({
      where: { esActivo: true },
      order: { nombre: 'ASC' },
    });
  }

  async getDocumentTypes(): Promise<DocumentType[]> {
    return this.documentTypesRepository.find({
      where: { esActivo: true },
      order: { nombre: 'ASC' },
    });
  }

  async checkUserTable(): Promise<any> {
    try {
      // Verificar estructura de la tabla usuarios
      const tableInfo = await this.dataSource.query('DESCRIBE usuarios');

      // Verificar si existe algún usuario
      const userCount = await this.usersRepository.count();

      return {
        tableStructure: tableInfo,
        userCount,
        message: 'Tabla usuarios verificada correctamente',
      };
    } catch (error: any) {
      throw new InternalServerErrorException(
        `Error verificando tabla usuarios: ${error.message}`,
      );
    }
  }

  async fixTableStructure(): Promise<void> {
    try {
      // Verificar que las tablas existan y tengan la estructura correcta
      const userTableCheck = await this.dataSource.query(
        'SHOW COLUMNS FROM usuarios WHERE Field = "id"'
      );
      
      const clientTableCheck = await this.dataSource.query(
        'SHOW COLUMNS FROM clientes WHERE Field = "id"'
      );

      console.log('Verificación de tablas completada:', {
        usuarios: userTableCheck.length > 0 ? 'OK' : 'ERROR',
        clientes: clientTableCheck.length > 0 ? 'OK' : 'ERROR'
      });
    } catch (error) {
      console.error('Error verificando tablas:', error);
      throw new InternalServerErrorException('Error verificando estructura de tablas');
    }
  }

  async getUserById(id: number): Promise<any> {
    try {
      if (!id || id <= 0) {
        throw new BadRequestException('ID de usuario inválido');
      }

      const user = await this.usersRepository.findOne({
        where: { id },
        relations: ['role', 'documentType', 'client'],
      });

      if (!user) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
      }

      // No devolver información sensible
      const {
        passwordHash,
        tokenVerificacion,
        tokenRecuperacion,
        ...safeUser
      } = user;

      return safeUser;
    } catch (error: unknown) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      this.logger.error(`Error obteniendo usuario ${id}:`, error);
      throw new InternalServerErrorException('Error interno del servidor');
    }
  }
}
