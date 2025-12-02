import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Query,
  Body,
  ParseIntPipe,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { VendorsService } from './vendors.service';

@Controller('vendors')
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) { }

  // Endpoint público para obtener vendedores por categoría
  @Get('by-category/:categoryId')
  async getVendorsByCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Query('limit') limit?: string,
  ) {
    const limitNum = limit ? parseInt(limit) : 10;
    return this.vendorsService.getVendorsByCategory(categoryId, limitNum);
  }

  // Rutas protegidas
  @UseGuards(JwtAuthGuard)

  // Obtener estadísticas del vendedor
  @Get(':id/stats')
  async getVendorStats(@Param('id', ParseIntPipe) vendorId: number) {
    return this.vendorsService.getVendorStats(vendorId);
  }

  // Obtener productos/recetas del vendedor
  @Get(':id/products')
  async getVendorProducts(
    @Param('id', ParseIntPipe) vendorId: number,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page) : 1;
    const limitNum = limit ? parseInt(limit) : 10;
    return this.vendorsService.getVendorProducts(vendorId, pageNum, limitNum);
  }

  // Obtener pedidos del vendedor
  @Get(':id/orders')
  async getVendorOrders(
    @Param('id', ParseIntPipe) vendorId: number,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page) : 1;
    const limitNum = limit ? parseInt(limit) : 10;
    return this.vendorsService.getVendorOrders(vendorId, pageNum, limitNum);
  }

  // Obtener analytics del vendedor
  @Get(':id/analytics')
  async getVendorAnalytics(
    @Param('id', ParseIntPipe) vendorId: number,
    @Query('days') days?: string,
  ) {
    const daysNum = days ? parseInt(days) : 30;
    return this.vendorsService.getVendorAnalytics(vendorId, daysNum);
  }

  // Obtener reseñas de las recetas del vendedor
  @Get(':id/reviews')
  async getVendorReviews(
    @Param('id', ParseIntPipe) vendorId: number,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page) : 1;
    const limitNum = limit ? parseInt(limit) : 10;
    return this.vendorsService.getVendorReviews(vendorId, pageNum, limitNum);
  }

  // Obtener clientes del vendedor
  @Get(':id/customers')
  async getVendorCustomers(@Param('id', ParseIntPipe) vendorId: number) {
    return this.vendorsService.getVendorCustomers(vendorId);
  }

  // Actualizar producto/receta del vendedor
  @Put(':vendorId/products/:productId')
  async updateVendorProduct(
    @Param('vendorId', ParseIntPipe) vendorId: number,
    @Param('productId', ParseIntPipe) productId: number,
    @Body() updateData: any,
  ) {
    return this.vendorsService.updateVendorRecipe(vendorId, productId, updateData);
  }

  // Activar/Desactivar producto del vendedor
  @Put(':vendorId/products/:productId/toggle')
  async toggleVendorProduct(
    @Param('vendorId', ParseIntPipe) vendorId: number,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.vendorsService.toggleVendorRecipe(vendorId, productId);
  }

  // Obtener configuración del vendedor
  @Get(':id/settings')
  async getVendorSettings(@Param('id', ParseIntPipe) vendorId: number) {
    return this.vendorsService.getVendorSettings(vendorId);
  }

  // --- Gestión de Productos Físicos ---

  // Obtener productos físicos de la tienda
  @Get(':id/store-products')
  async getStoreProducts(
    @Param('id', ParseIntPipe) userId: number,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page) : 1;
    const limitNum = limit ? parseInt(limit) : 10;
    return this.vendorsService.getStoreProducts(userId, pageNum, limitNum);
  }

  // Crear producto físico
  @UseGuards(JwtAuthGuard)
  @Post(':id/store-products')
  async createStoreProduct(
    @Param('id', ParseIntPipe) userId: number,
    @Body() createData: any,
  ) {
    return this.vendorsService.createStoreProduct(userId, createData);
  }

  // Actualizar producto físico
  @UseGuards(JwtAuthGuard)
  @Put(':id/store-products/:productId')
  async updateStoreProduct(
    @Param('id', ParseIntPipe) userId: number,
    @Param('productId', ParseIntPipe) productId: number,
    @Body() updateData: any,
  ) {
    return this.vendorsService.updateStoreProduct(userId, productId, updateData);
  }

  // Toggle producto físico
  @UseGuards(JwtAuthGuard)
  @Put(':id/store-products/:productId/toggle')
  async toggleStoreProduct(
    @Param('id', ParseIntPipe) userId: number,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.vendorsService.toggleStoreProduct(userId, productId);
  }

  // Importar productos desde Excel
  @UseGuards(JwtAuthGuard)
  @Post(':id/products/import')
  @UseInterceptors(FileInterceptor('file'))
  async importProducts(
    @Param('id', ParseIntPipe) userId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('Archivo requerido');
    return this.vendorsService.importProducts(userId, file);
  }
}
