import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ClientsService {
    constructor(private prisma: PrismaService) { }

    // Obtener datos completos del cliente
    async getClientData(userId: number) {
        try {
            const client = await this.prisma.client.findUnique({
                where: { usuarioId: userId },
                include: {
                    usuario: {
                        select: {
                            id: true,
                            nombres: true,
                            apellidos: true,
                            email: true,
                            telefono: true,
                            fotoPerfil: true,
                            direccion: true,
                            bio: true,
                            ciudad: true,
                            pais: true,
                            fechaNacimiento: true,
                            genero: true,
                            createdAt: true,
                        }
                    },
                    plan: true,
                }
            });

            if (!client) {
                throw new NotFoundException('Cliente no encontrado');
            }

            return {
                success: true,
                client: {
                    ...client,
                    usuario: client.usuario,
                },
            };
        } catch (error) {
            console.error('Error obteniendo datos del cliente:', error);
            throw error;
        }
    }

    // Obtener recetas favoritas del cliente
    async getFavoriteRecipes(userId: number, limit: number = 20) {
        try {
            const favorites = await this.prisma.userFavoriteRecipe.findMany({
                where: { usuarioId: userId },
                include: {
                    receta: {
                        include: {
                            categoria: true,
                            dificultad: true,
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                take: limit,
            });

            return {
                success: true,
                recipes: favorites.map(f => f.receta),
                total: favorites.length,
            };
        } catch (error) {
            console.error('Error obteniendo recetas favoritas:', error);
            return {
                success: false,
                recipes: [],
                total: 0,
            };
        }
    }

    // Obtener despensa del cliente
    async getPantry(userId: number) {
        try {
            const pantry = await this.prisma.userPantry.findMany({
                where: {
                    usuarioId: userId,
                    esActivo: true,
                },
                include: {
                    ingredienteMaestro: true,
                    unidadMedida: true,
                },
                orderBy: { fechaVencimiento: 'asc' }
            });

            // Calcular ingredientes por vencer (próximos 7 días)
            const today = new Date();
            const nextWeek = new Date();
            nextWeek.setDate(today.getDate() + 7);

            const expiringSoon = pantry.filter(item => {
                if (!item.fechaVencimiento) return false;
                const expiryDate = new Date(item.fechaVencimiento);
                return expiryDate >= today && expiryDate <= nextWeek;
            });

            return {
                success: true,
                items: pantry,
                total: pantry.length,
                expiringSoon: expiringSoon.length,
            };
        } catch (error) {
            console.error('Error obteniendo despensa:', error);
            return {
                success: false,
                items: [],
                total: 0,
                expiringSoon: 0,
            };
        }
    }

    // Obtener actividad reciente del cliente
    async getActivity(userId: number, limit: number = 20) {
        try {
            const activities = await this.prisma.userActivity.findMany({
                where: {
                    usuarioId: userId,
                    esActivo: true,
                },
                orderBy: { fecha: 'desc' },
                take: limit,
            });

            return {
                success: true,
                activities,
                total: activities.length,
            };
        } catch (error) {
            console.error('Error obteniendo actividad:', error);
            return {
                success: false,
                activities: [],
                total: 0,
            };
        }
    }

    // Actualizar perfil del cliente
    async updateProfile(userId: number, updateData: any) {
        try {
            const updateFields: any = {};

            // Campos del usuario
            if (updateData.nombres !== undefined) updateFields.nombres = updateData.nombres;
            if (updateData.apellidos !== undefined) updateFields.apellidos = updateData.apellidos;
            if (updateData.email !== undefined) updateFields.email = updateData.email;
            if (updateData.telefono !== undefined) updateFields.telefono = updateData.telefono;
            if (updateData.direccion !== undefined) updateFields.direccion = updateData.direccion;
            if (updateData.bio !== undefined) updateFields.bio = updateData.bio;
            if (updateData.ciudad !== undefined) updateFields.ciudad = updateData.ciudad;
            if (updateData.pais !== undefined) updateFields.pais = updateData.pais;
            if (updateData.fechaNacimiento !== undefined) {
                updateFields.fechaNacimiento = new Date(updateData.fechaNacimiento);
            }

            // Actualizar contraseña si se proporciona
            if (updateData.password && updateData.password.trim() !== '') {
                const salt = await bcrypt.genSalt();
                updateFields.passwordHash = await bcrypt.hash(updateData.password, salt);
            }

            const updatedUser = await this.prisma.user.update({
                where: { id: userId },
                data: updateFields,
                select: {
                    id: true,
                    nombres: true,
                    apellidos: true,
                    email: true,
                    telefono: true,
                    direccion: true,
                    bio: true,
                    ciudad: true,
                    pais: true,
                    fechaNacimiento: true,
                    fotoPerfil: true,
                    genero: true,
                }
            });

            return {
                success: true,
                message: 'Perfil actualizado correctamente',
                user: updatedUser,
            };
        } catch (error) {
            console.error('Error actualizando perfil:', error);
            throw error;
        }
    }

    // Obtener historial de puntos
    async getPointsHistory(userId: number) {
        try {
            const activities = await this.prisma.userActivity.findMany({
                where: {
                    usuarioId: userId,
                    esActivo: true,
                },
                orderBy: { fecha: 'desc' },
                take: 50,
            });

            // Calcular puntos por actividad
            const pointsMap = {
                'RECETA_VISTA': 1,
                'RECETA_PREPARADA': 5,
                'COMPRA_REALIZADA': 3,
                'RESENA_PUBLICADA': 2,
                'FAVORITO_AGREGADO': 1,
                'PERFIL_ACTUALIZADO': 1,
                'LOGIN': 1,
            };

            const history = activities.map(activity => ({
                id: activity.id,
                tipo: activity.tipo,
                descripcion: activity.descripcion,
                puntos: pointsMap[activity.tipo] || 0,
                fecha: activity.fecha,
            }));

            const totalPuntos = history.reduce((sum, item) => sum + item.puntos, 0);

            return {
                success: true,
                history,
                totalPuntos,
            };
        } catch (error) {
            console.error('Error obteniendo historial de puntos:', error);
            return {
                success: false,
                history: [],
                totalPuntos: 0,
            };
        }
    }

    // Calcular y actualizar puntos del cliente
    async updatePoints(userId: number) {
        try {
            const pointsHistory = await this.getPointsHistory(userId);
            const totalPuntos = pointsHistory.totalPuntos;

            // Determinar nivel basado en puntos
            let nivel = 'BRONCE';
            if (totalPuntos >= 1000) nivel = 'ORO';
            else if (totalPuntos >= 500) nivel = 'PLATA';

            // Actualizar cliente
            await this.prisma.client.update({
                where: { usuarioId: userId },
                data: {
                    puntosFidelidad: totalPuntos,
                    nivelCliente: nivel as any,
                }
            });

            return {
                success: true,
                puntos: totalPuntos,
                nivel,
            };
        } catch (error) {
            console.error('Error actualizando puntos:', error);
            throw error;
        }
    }

    // Obtener estadísticas del cliente
    async getStats(userId: number) {
        try {
            const [client, favoriteRecipes, pantry, activities] = await Promise.all([
                this.prisma.client.findUnique({
                    where: { usuarioId: userId },
                    include: { plan: true }
                }),
                this.prisma.userFavoriteRecipe.count({
                    where: { usuarioId: userId }
                }),
                this.prisma.userPantry.count({
                    where: { usuarioId: userId, esActivo: true }
                }),
                this.prisma.userActivity.count({
                    where: { usuarioId: userId, esActivo: true }
                }),
            ]);

            return {
                success: true,
                stats: {
                    puntosFidelidad: client?.puntosFidelidad || 0,
                    nivelCliente: client?.nivelCliente || 'BRONCE',
                    recetasFavoritas: favoriteRecipes,
                    ingredientesEnDespensa: pantry,
                    totalActividades: activities,
                    plan: client?.plan?.nombre || 'Básico',
                    limiteRecetas: client?.plan?.limiteRecetasFavoritas || 10,
                    limiteIngredientes: client?.plan?.limiteIngredientes || 50,
                }
            };
        } catch (error) {
            console.error('Error obteniendo estadísticas:', error);
            throw error;
        }
    }
}
