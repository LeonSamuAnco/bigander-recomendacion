import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('roles')
  getRoles() {
    return this.authService.getRoles();
  }

  @Get('document-types')
  getDocumentTypes() {
    return this.authService.getDocumentTypes();
  }

  @Get('test-db')
  async testDatabase() {
    try {
      const roles = await this.authService.getRoles();
      const documentTypes = await this.authService.getDocumentTypes();
      return {
        message: 'Conexión a BD exitosa',
        roles: roles.length,
        documentTypes: documentTypes.length,
        rolesData: roles,
        documentTypesData: documentTypes,
      };
    } catch (error: any) {
      return {
        message: 'Error de conexión a BD',
        error: error.message,
      };
    }
  }

  @Get('check-tables')
  async checkTables() {
    try {
      // Verificar estructura de tablas usuarios y clientes
      const userTableInfo = await this.authService.checkUserTable();
      return {
        message: 'Verificación de tablas exitosa',
        userTableInfo,
      };
    } catch (error: any) {
      return {
        message: 'Error verificando tablas',
        error: error.message,
      };
    }
  }

  @Get('fix-tables')
  async fixTables() {
    try {
      // Ejecutar los comandos de corrección directamente
      await this.authService.fixTableStructure();
      return {
        message: 'Tablas corregidas exitosamente',
      };
    } catch (error: any) {
      return {
        message: 'Error corrigiendo tablas',
        error: error.message,
      };
    }
  }

  @Get('user/:id')
  async getUserById(@Param('id') id: string) {
    try {
      const userId = parseInt(id);
      const user = await this.authService.getUserById(userId);
      
      if (!user) {
        return {
          message: 'Usuario no encontrado',
          error: 'USER_NOT_FOUND'
        };
      }

      // Remover información sensible
      const { passwordHash, tokenVerificacion, tokenRecuperacion, ...safeUser } = user;
      
      return {
        message: 'Usuario encontrado',
        user: safeUser,
      };
    } catch (error: any) {
      return {
        message: 'Error obteniendo usuario',
        error: error.message,
      };
    }
  }
}
