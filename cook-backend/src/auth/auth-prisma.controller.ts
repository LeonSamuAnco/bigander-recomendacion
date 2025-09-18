import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
} from '@nestjs/common';
import { AuthPrismaService } from './auth-prisma.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthPrismaController {
  constructor(private authPrismaService: AuthPrismaService) {}

  @Post('register')
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.authPrismaService.register(registerUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authPrismaService.login(loginUserDto);
  }

  @Get('roles')
  getRoles() {
    return this.authPrismaService.getRoles();
  }

  @Get('document-types')
  getDocumentTypes() {
    return this.authPrismaService.getDocumentTypes();
  }

  @Get('client-plans')
  getClientPlans() {
    return this.authPrismaService.getClientPlans();
  }

  @Get('test-db')
  async testDatabase() {
    try {
      const roles = await this.authPrismaService.getRoles();
      const documentTypes = await this.authPrismaService.getDocumentTypes();
      const clientPlans = await this.authPrismaService.getClientPlans();
      
      return {
        message: 'Conexión a BD con Prisma exitosa',
        roles: roles.length,
        documentTypes: documentTypes.length,
        clientPlans: clientPlans.length,
        rolesData: roles,
        documentTypesData: documentTypes,
        clientPlansData: clientPlans,
      };
    } catch (error: any) {
      return {
        message: 'Error de conexión a BD con Prisma',
        error: error.message,
      };
    }
  }

  @Get('users/:id')
  async getUserById(@Body('id') id: number) {
    try {
      const user = await this.authPrismaService.getUserById(id);
      return {
        message: 'Usuario encontrado',
        user,
      };
    } catch (error: any) {
      return {
        message: 'Error obteniendo usuario',
        error: error.message,
      };
    }
  }
}
