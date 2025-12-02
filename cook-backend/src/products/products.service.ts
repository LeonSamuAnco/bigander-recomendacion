import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) { }

  async findAll(params: { search?: string; categoryId?: string; vendorId?: string;[key: string]: any }) {
    const { search, categoryId, vendorId, ...dynamicFilters } = params;
    const where: Prisma.ProductWhereInput = {
      esActivo: true,
    };

    if (search) {
      where.nombre = {
        contains: search,
      };
    }

    if (categoryId) {
      where.categoriaId = parseInt(categoryId, 10);
    }

    if (vendorId) {
      where.vendedorId = parseInt(vendorId, 10);
    }

    if (Object.keys(dynamicFilters).length > 0) {
      where.AND = Object.entries(dynamicFilters).map(([key, value]) => ({
        atributos: {
          path: [key],
          equals: value,
        },
      }));
    }

    return this.prisma.product.findMany({
      where,
      include: {
        categoria: true,
        vendedor: true,
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        categoria: true,
        vendedor: true,
      },
    });
  }

  async findAllCategories() {
    return this.prisma.productCategory.findMany({
      where: { esActivo: true },
    });
  }

  async create(data: any) {
    return this.prisma.product.create({
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion || '',
        precio: data.precio || 0,
        stock: data.stock || 0,
        categoriaId: parseInt(data.categoriaId),
        vendedorId: data.vendedorId ? parseInt(data.vendedorId) : null,
        imagenUrl: data.imagenUrl || null,
        sku: data.sku || null,
        atributos: data.atributos || {},
        esActivo: true,
      },
      include: {
        categoria: true,
        vendedor: true,
      },
    });
  }

  async update(id: number, data: any) {
    const updateData: any = {
      nombre: data.nombre,
      descripcion: data.descripcion,
      precio: data.precio,
      stock: data.stock,
      categoriaId: data.categoriaId ? parseInt(data.categoriaId) : undefined,
      imagenUrl: data.imagenUrl,
      sku: data.sku,
      atributos: data.atributos,
    };

    if (data.vendedorId) {
      updateData.vendedorId = parseInt(data.vendedorId);
    }

    return this.prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        categoria: true,
        vendedor: true,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.product.update({
      where: { id },
      data: { esActivo: false },
    });
  }

  async toggleStatus(id: number) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new Error('Producto no encontrado');
    }
    return this.prisma.product.update({
      where: { id },
      data: { esActivo: !product.esActivo },
    });
  }

  async getCategoryStats(categoryId: number) {
    const total = await this.prisma.product.count({
      where: { categoriaId: categoryId, esActivo: true },
    });

    const totalStock = await this.prisma.product.aggregate({
      where: { categoriaId: categoryId, esActivo: true },
      _sum: { stock: true },
    });

    const avgPrice = await this.prisma.product.aggregate({
      where: { categoriaId: categoryId, esActivo: true },
      _avg: { precio: true },
    });

    return {
      total,
      totalStock: totalStock._sum.stock || 0,
      avgPrice: avgPrice._avg.precio || 0,
    };
  }
}
