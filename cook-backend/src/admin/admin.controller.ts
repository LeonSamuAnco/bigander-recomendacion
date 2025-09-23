import {
  Controller,
  Get,
  Put,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  Body,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Endpoint de prueba sin guards
  @Get('test')
  test() {
    return { message: 'Admin module working', timestamp: new Date() };
  }

  // Endpoint de prueba para estadísticas sin guards
  @Get('test-stats')
  async testStats() {
    try {
      const stats = await this.adminService.getSystemStats();
      return { success: true, stats };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Obtener estadísticas del sistema
  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getSystemStats() {
    try {
      console.log('Admin: Getting system stats');
      const stats = await this.adminService.getSystemStats();
      console.log('Admin: Stats retrieved successfully', stats);
      return stats;
    } catch (error) {
      console.error('Admin: Error getting stats:', error);
      throw error;
    }
  }

  // Obtener todos los usuarios con paginación y búsqueda
  @Get('users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getAllUsers(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
    @Query('search') search?: string,
  ) {
    return this.adminService.getAllUsers(page, limit, search);
  }

  // Obtener usuarios recientes
  @Get('users/recent')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getRecentUsers(@Query('limit') limit?: string) {
    try {
      const limitNum = limit ? parseInt(limit) : 5;
      return await this.adminService.getRecentUsers(limitNum);
    } catch (error) {
      console.error('Error in getRecentUsers controller:', error);
      return [];
    }
  }

  // Endpoint de prueba para usuarios recientes sin guards
  @Get('test-recent-users')
  async testRecentUsers() {
    try {
      const users = await this.adminService.getRecentUsers(5);
      return { success: true, users };
    } catch (error) {
      return { success: false, error: error.message, users: [] };
    }
  }

  // Activar/Desactivar usuario
  @Put('users/:id/toggle-status')
  async toggleUserStatus(@Param('id', ParseIntPipe) userId: number) {
    return this.adminService.toggleUserStatus(userId);
  }

  // Obtener roles del sistema
  @Get('roles')
  async getSystemRoles() {
    return this.adminService.getSystemRoles();
  }

  // Cambiar rol de usuario
  @Put('users/:id/role')
  async changeUserRole(
    @Param('id', ParseIntPipe) userId: number,
    @Body('roleId', ParseIntPipe) newRoleId: number,
  ) {
    return this.adminService.changeUserRole(userId, newRoleId);
  }

  // Obtener reportes del sistema
  @Get('reports')
  async getSystemReports() {
    return this.adminService.getSystemReports();
  }

  // ========================================
  // GESTIÓN DE RECETAS PARA ADMIN
  // ========================================

  // Obtener todas las recetas para administración
  @Get('recipes')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getAllRecipes(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    try {
      const pageNum = page ? parseInt(page) : 1;
      const limitNum = limit ? parseInt(limit) : 10;
      return await this.adminService.getAllRecipes(pageNum, limitNum, search);
    } catch (error) {
      return { success: false, recipes: [], total: 0 };
    }
  }

  // Endpoint de prueba para obtener recetas sin guards
  @Get('test-recipes')
  async testGetRecipes() {
    try {
      const recipes = await this.adminService.getAllRecipes(1, 10);
      return { success: true, ...recipes };
    } catch (error) {
      return { success: false, error: error.message, recipes: [], total: 0 };
    }
  }

  // Obtener estadísticas de recetas
  @Get('recipes/stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getRecipesStats() {
    return this.adminService.getRecipesStats();
  }

  // Activar/Desactivar receta
  @Put('recipes/:id/toggle-status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async toggleRecipeStatus(@Param('id') recipeId: string) {
    return this.adminService.toggleRecipeStatus(parseInt(recipeId));
  }
}
