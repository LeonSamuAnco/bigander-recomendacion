import { Controller, Get, Put, Post, Delete, Param, ParseIntPipe, Body } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { UpdateClientDto } from './dto/update-client.dto';
import { AddPantryItemDto } from './dto/add-pantry-item.dto';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get(':id')
  async getClient(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.clientsService.getClientById(id);
    } catch (error) {
      return { success: false, error: 'Error al obtener cliente' };
    }
  }

  @Get(':id/favorite-recipes')
  async getFavoriteRecipes(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.clientsService.getFavoriteRecipes(id);
    } catch (error) {
      return { success: false, recipes: [], error: 'Error al obtener favoritas' };
    }
  }

  @Get(':id/pantry')
  async getPantry(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.clientsService.getPantry(id);
    } catch (error) {
      return { success: false, items: [], error: 'Error al obtener despensa' };
    }
  }

  @Get(':id/activity')
  async getActivity(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.clientsService.getRecentActivity(id);
    } catch (error) {
      return { success: false, activities: [], error: 'Error al obtener actividad' };
    }
  }

  @Get(':id/stats')
  async getStats(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.clientsService.getClientStats(id);
    } catch (error) {
      return { success: false, stats: {}, error: 'Error al obtener estadísticas' };
    }
  }

  @Put(':id')
  async updateClient(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateClientDto: UpdateClientDto
  ) {
    try {
      return await this.clientsService.updateClient(id, updateClientDto);
    } catch (error) {
      return { success: false, error: 'Error al actualizar cliente' };
    }
  }

  @Post(':id/pantry')
  async addPantryItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() addPantryItemDto: AddPantryItemDto
  ) {
    try {
      return await this.clientsService.addPantryItem(id, addPantryItemDto);
    } catch (error) {
      return { success: false, error: 'Error al agregar ingrediente' };
    }
  }

  @Delete(':id/pantry/:itemId')
  async deletePantryItem(
    @Param('id', ParseIntPipe) id: number,
    @Param('itemId', ParseIntPipe) itemId: number
  ) {
    try {
      return await this.clientsService.deletePantryItem(id, itemId);
    } catch (error) {
      return { success: false, error: 'Error al eliminar ingrediente' };
    }
  }
}
