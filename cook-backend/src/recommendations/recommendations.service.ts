import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface RecommendationScore {
  tipo: string;
  itemId: number;
  score: number;
  razon: string[];
  item?: any;
}

interface UserProfile {
  interes: {
    recetas: number;
    celulares: number;
    laptops: number;
    accesorios: number;
    tortas: number;
    lugares: number;
    deportes: number;
  };
  preferencias: {
    precioMin: number;
    precioMax: number;
    precioPromedio: number;
    marcas: Map<string, number>;
    transacciones: number;
  };
  historial: {
    vistos: Set<number>; // IDs de items vistos
    categorias: Map<number, number>;
  }
}

interface UsuarioSimilar {
  id: number;
  similaridad: number;
}

@Injectable()
export class RecommendationsService {
  constructor(private prisma: PrismaService) { }

  /**
   * Obtener recomendaciones personalizadas basadas en el historial del usuario
   * Incluye Collaborative Filtering y Content-Based Filtering
   */
  async getPersonalizedRecommendations(
    userId: number,
    limit: number = 12,
  ): Promise<any[]> {
    // 1. Obtener historial reciente (optimizado a 60 días para relevancia)
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() - 60);

    const actividades = await this.prisma.userActivity.findMany({
      where: {
        usuarioId: userId,
        fecha: { gte: fechaLimite },
        esActivo: true,
      },
      orderBy: { fecha: 'desc' },
      take: 200,
    });

    // 2. Construir perfil de usuario avanzado
    const perfil = await this.construirPerfilUsuario(userId, actividades);

    // 3. Ejecutar estrategias de recomendación en paralelo
    const strategies: Promise<RecommendationScore[]>[] = [];

    const intereses = [
      perfil.interes.laptops, perfil.interes.accesorios, perfil.interes.celulares,
      perfil.interes.recetas, perfil.interes.lugares, perfil.interes.tortas, perfil.interes.deportes
    ];
    const tieneHistorial = intereses.some(i => i > 0);

    if (tieneHistorial) {
      // Enfoque Personalizado
      if (perfil.interes.laptops > 0) strategies.push(this.recomendarLaptops(perfil));
      if (perfil.interes.accesorios > 0) strategies.push(this.recomendarAccesorios(perfil));
      if (perfil.interes.celulares > 0) strategies.push(this.recomendarCelulares(perfil));
      if (perfil.interes.recetas > 0) strategies.push(this.recomendarRecetas(userId, perfil));
      if (perfil.interes.lugares > 0) strategies.push(this.recomendarLugares(userId, perfil));
      if (perfil.interes.tortas > 0) strategies.push(this.recomendarTortas(userId, perfil));
      if (perfil.interes.deportes > 0) strategies.push(this.recomendarDeportes(userId, perfil));
    } else {
      // COLD START: Inyectar mix completo de las 7 categorías
      strategies.push(this.recomendarLaptops(perfil));
      strategies.push(this.recomendarCelulares(perfil));
      strategies.push(this.recomendarAccesorios(perfil));
      strategies.push(this.recomendarRecetas(userId, perfil));
      strategies.push(this.recomendarTortas(userId, perfil));
      strategies.push(this.recomendarLugares(userId, perfil));
      strategies.push(this.recomendarDeportes(userId, perfil));
    }

    strategies.push(this.aplicarCollaborativeFiltering(userId, []));

    const results = await Promise.all(strategies);
    let recomendaciones = results.flat();

    // 4. Post-procesamiento y Diversificación
    recomendaciones = this.diversificarRecomendaciones(recomendaciones, perfil, limit);

    // 5. Obtener detalles finales
    return await this.obtenerDetallesRecomendaciones(recomendaciones);
  }

  private async construirPerfilUsuario(userId: number, actividades: any[]): Promise<UserProfile> {
    const perfil: UserProfile = {
      interes: {
        recetas: 0, celulares: 0, laptops: 0, accesorios: 0,
        tortas: 0, lugares: 0, deportes: 0
      },
      preferencias: {
        precioMin: 0, precioMax: 10000, precioPromedio: 0,
        marcas: new Map(),
        transacciones: 0
      },
      historial: {
        vistos: new Set(),
        categorias: new Map()
      }
    };

    const favoritos = await this.prisma.favorite.findMany({
      where: { usuarioId: userId, esActivo: true },
      select: { tipo: true, referenciaId: true },
    });

    favoritos.forEach(f => {
      perfil.historial.vistos.add(f.referenciaId);
      const mapping: any = {
        'receta': 'recetas', 'celular': 'celulares', 'torta': 'tortas',
        'lugar': 'lugares', 'deporte': 'deportes'
      };
      const key = mapping[f.tipo];
      if (key && key in perfil.interes) {
        perfil.interes[key as keyof typeof perfil.interes] += 10;
      }
    });

    let sumaPrecios = 0;
    let conteoPrecios = 0;
    const itemsVistosIds: Record<string, number[]> = { laptop: [], celular: [], accesorio: [] };

    const now = new Date().getTime();

    actividades.forEach(act => {
      const dias = (now - new Date(act.fecha).getTime()) / (1000 * 3600 * 24);
      const pesoTemoral = Math.max(0.2, 1 - (dias * 0.05));

      if (act.referenciaId) perfil.historial.vistos.add(act.referenciaId);

      switch (act.tipo) {
        case 'PRODUCTO_VISTO':
          const catId = act.metadata?.categoriaId || act.metadata?.categoria_id;
          if (catId) {
            const pesoCat = perfil.historial.categorias.get(catId) || 0;
            perfil.historial.categorias.set(catId, pesoCat + pesoTemoral);
          }

          // Detección heurística de categoría por ID o metadata
          if (catId === 55 || (act.metadata?.categoriaNombre && act.metadata.categoriaNombre.includes('Laptop'))) {
            perfil.interes.laptops += pesoTemoral;
            if (act.referenciaId) itemsVistosIds.laptop.push(act.referenciaId);
          } else if (catId === 56 || (act.metadata?.categoriaNombre && act.metadata.categoriaNombre.includes('Accesorio'))) {
            perfil.interes.accesorios += pesoTemoral;
            if (act.referenciaId) itemsVistosIds.accesorio.push(act.referenciaId);
          } else if (catId === 2 || (act.metadata?.categoriaNombre && act.metadata.categoriaNombre.includes('Celular'))) {
            perfil.interes.celulares += pesoTemoral;
            if (act.referenciaId) itemsVistosIds.celular.push(act.referenciaId);
          }
          break;
        case 'CELULAR_VISTO':
          perfil.interes.celulares += pesoTemoral;
          if (act.referenciaId) itemsVistosIds.celular.push(act.referenciaId);
          break;
        case 'RECETA_VISTO': perfil.interes.recetas += pesoTemoral; break;
      }
    });

    if (itemsVistosIds.laptop.length > 0 || itemsVistosIds.celular.length > 0) {
      actividades.forEach(act => {
        if (act.metadata?.marca) {
          const marca = act.metadata.marca;
          const peso = perfil.preferencias.marcas.get(marca) || 0;
          perfil.preferencias.marcas.set(marca, peso + 1);
        }
        if (act.metadata?.precio) {
          sumaPrecios += Number(act.metadata.precio);
          conteoPrecios++;
        }
      });
    }

    if (conteoPrecios > 0) {
      perfil.preferencias.precioPromedio = sumaPrecios / conteoPrecios;
      perfil.preferencias.precioMin = perfil.preferencias.precioPromedio * 0.6;
      perfil.preferencias.precioMax = perfil.preferencias.precioPromedio * 1.4;
    }

    return perfil;
  }

  private diversificarRecomendaciones(items: RecommendationScore[], perfil: UserProfile, limit: number): RecommendationScore[] {
    const itemsPorCategoria: Record<string, RecommendationScore[]> = {};

    items.forEach(item => {
      if (!itemsPorCategoria[item.tipo]) itemsPorCategoria[item.tipo] = [];
      itemsPorCategoria[item.tipo].push(item);
    });

    Object.keys(itemsPorCategoria).forEach(tipo => {
      itemsPorCategoria[tipo].sort((a, b) => b.score - a.score);
    });

    const final: RecommendationScore[] = [];
    const idsSeleccionados = new Set<number>();

    // 2. Ronda de Inclusión Garantizada: Round Robin
    const tiposDisponibles = Object.keys(itemsPorCategoria);

    // Iterar cíclicamente hasta llenar el límite o agotar items
    let algoAgregado = true;
    while (final.length < limit && algoAgregado) {
      algoAgregado = false;
      for (const tipo of tiposDisponibles) {
        if (final.length >= limit) break;

        // Buscar un item de este tipo que no haya sido seleccionado
        const candidato = itemsPorCategoria[tipo].find(i => !idsSeleccionados.has(i.itemId) && !perfil.historial.vistos.has(i.itemId));
        // Si no hay nuevos, buscar repetidos (si se permite) o saltar. Aquí preferimos variedad.

        if (candidato) {
          final.push(candidato);
          idsSeleccionados.add(candidato.itemId);
          algoAgregado = true;
        } else if (itemsPorCategoria[tipo].length > 0) {
          // Si ya vimos todos los 'no vistos', rellenar con top items aunque vistos (fallback ultimo recurso)
          const topItem = itemsPorCategoria[tipo].find(i => !idsSeleccionados.has(i.itemId));
          if (topItem) {
            final.push(topItem);
            idsSeleccionados.add(topItem.itemId);
            algoAgregado = true;
          }
        }
      }
    }

    return final.sort((a, b) => b.score - a.score); // Reordenar por score global al final? O mantener mix? 
    // Mejor mantener Round Robin order para UI variada, pero si el UI ordena, mejor devolver por Score.
    // El usuario quiere ver variedad "al toque". Devolveremos mezclado (Round Robin implícito en la construcción) o ajustaremos score.
    // Vamos a devolver tal cual se construyó (mezclado) para que el frontend no agrupe todo lo de score 100 al inicio.
    return final;
  }

  // --- RECOMENDADORES ---

  private async recomendarRecetas(userId: number, perfil: UserProfile): Promise<RecommendationScore[]> {
    const recomendaciones: RecommendationScore[] = [];
    const recetas = await this.prisma.recipe.findMany({
      where: { esActivo: true }, include: { categoria: true, dificultad: true }, take: 8, orderBy: { popularidad: 'desc' },
    });
    recetas.forEach((receta) => {
      if (perfil.historial.vistos.has(receta.id)) return;
      let score = 50 + Number(receta.calificacionPromedio) * 10 + perfil.interes.recetas;
      if (receta.esDestacada) score += 20;
      recomendaciones.push({ tipo: 'receta', itemId: receta.id, score: Math.round(score), razon: [`Popular en ${receta.categoria.nombre}`], item: receta });
    });
    return recomendaciones;
  }

  private async recomendarCelulares(perfil: UserProfile): Promise<RecommendationScore[]> {
    const recomendaciones: RecommendationScore[] = [];
    const celulares = await this.prisma.celulares.findMany({ include: { items: true, celular_marcas: true, celular_gamas: true }, take: 8, orderBy: { fecha_lanzamiento: 'desc' } });
    celulares.forEach((celular) => {
      let score = 80 + Math.min((perfil.interes.celulares || 0), 20) * 5;
      if (celular.celular_marcas?.nombre && perfil.preferencias.marcas.has(celular.celular_marcas.nombre)) score += 40;
      if (perfil.historial.vistos.has(celular.item_id)) score -= 30;
      recomendaciones.push({ tipo: 'celular', itemId: celular.item_id, score, razon: ['Gama recomendada'], item: celular });
    });
    return recomendaciones;
  }

  private async recomendarLaptops(perfil: UserProfile): Promise<RecommendationScore[]> {
    const recomendaciones: RecommendationScore[] = [];
    let laptops = await this.prisma.laptops.findMany({ include: { items: true, laptop_marcas: true, laptop_procesadores: true }, take: 8 });

    if (laptops.length === 0) {
      // FALLBACK: Buscar categoría por nombre para ser robusto
      const catLaptop = await this.prisma.productCategory.findFirst({
        where: { nombre: { contains: 'Laptop' } }
      });

      if (catLaptop) {
        const products = await this.prisma.product.findMany({
          where: { categoriaId: catLaptop.id },
          take: 8,
          orderBy: { nombre: 'asc' }
        });

        products.forEach(prod => {
          let score = 95 + (perfil.interes.laptops || 0) * 15; // Score competitivo
          if (perfil.historial.vistos.has(prod.id)) score -= 20; else score += 20;

          recomendaciones.push({
            tipo: 'producto',
            itemId: prod.id,
            score: Math.round(score),
            razon: ['Laptop Recomendada'],
            item: {
              item_id: prod.id,
              categoriaId: catLaptop.id,
              nombre: prod.nombre,
              descripcion: prod.descripcion,
              imagen_principal_url: prod.imagenUrl,
              items: { nombre: prod.nombre, imagen_principal_url: prod.imagenUrl, descripcion: prod.descripcion },
              precio: prod.precio,
              laptop_marcas: { nombre: 'Modelo' }
            }
          });
        });
      }
      return recomendaciones;
    }

    laptops.forEach((laptop) => {
      let score = 100 + perfil.interes.laptops * 10;
      if (laptop.laptop_marcas?.nombre && perfil.preferencias.marcas.has(laptop.laptop_marcas.nombre)) score += 30;
      if (perfil.historial.vistos.has(laptop.item_id)) score -= 20; else score += 20;
      recomendaciones.push({ tipo: 'laptop', itemId: laptop.item_id, score: Math.round(score), razon: ['Tecnología', laptop.laptop_marcas?.nombre], item: laptop });
    });
    return recomendaciones;
  }

  private async recomendarAccesorios(perfil: UserProfile): Promise<RecommendationScore[]> {
    const recomendaciones: RecommendationScore[] = [];
    let accesorios = await this.prisma.accesorios_celular.findMany({ include: { items: true, accesorio_marcas: true, accesorio_tipos: true }, take: 8 });

    if (accesorios.length === 0) {
      const catAcc = await this.prisma.productCategory.findFirst({
        where: { nombre: { contains: 'Accesorio' } }
      });

      if (catAcc) {
        const products = await this.prisma.product.findMany({ where: { categoriaId: catAcc.id }, take: 8 });
        products.forEach(prod => {
          let score = 95 + (perfil.interes.accesorios || 0) * 15;
          if (perfil.historial.vistos.has(prod.id)) score -= 20; else score += 25;

          recomendaciones.push({
            tipo: 'producto',
            itemId: prod.id,
            score: Math.round(score),
            razon: ['Accesorio Recomendado'],
            item: {
              item_id: prod.id,
              categoriaId: catAcc.id,
              nombre: prod.nombre,
              descripcion: prod.descripcion,
              imagen_principal_url: prod.imagenUrl,
              items: { nombre: prod.nombre, imagen_principal_url: prod.imagenUrl, descripcion: prod.descripcion },
              precio: prod.precio,
              accesorio_marcas: { nombre: 'General' }
            }
          });
        });
      }
      return recomendaciones;
    }

    accesorios.forEach((acc) => {
      let score = 100 + perfil.interes.accesorios * 10;
      if (acc.accesorio_marcas?.nombre && perfil.preferencias.marcas.has(acc.accesorio_marcas.nombre)) score += 25;
      if (perfil.historial.vistos.has(acc.item_id)) score -= 20; else score += 15;
      recomendaciones.push({ tipo: 'accesorio', itemId: acc.item_id, score: Math.round(score), razon: ['Accesorio recomendado'], item: acc });
    });
    return recomendaciones;
  }

  private async recomendarTortas(userId: number, perfil: UserProfile): Promise<RecommendationScore[]> {
    const recomendaciones: RecommendationScore[] = [];
    const tortas = await this.prisma.tortas.findMany({ include: { items: true, torta_sabores: true }, take: 5 });
    tortas.forEach(t => {
      if (perfil.historial.vistos.has(t.item_id)) return;
      recomendaciones.push({ tipo: 'torta', itemId: t.item_id, score: 60 + perfil.interes.tortas * 5, razon: ['Dulce recomendado'], item: t });
    });
    return recomendaciones;
  }

  private async recomendarLugares(userId: number, perfil: UserProfile): Promise<RecommendationScore[]> {
    const recomendaciones: RecommendationScore[] = [];
    const lugares = await this.prisma.lugares.findMany({ include: { items: true, lugar_tipos: true }, take: 4 });
    lugares.forEach(l => {
      if (perfil.historial.vistos.has(l.item_id)) return;
      recomendaciones.push({ tipo: 'lugar', itemId: l.item_id, score: 65 + perfil.interes.lugares * 5, razon: ['Lugar destacado'], item: l });
    });
    return recomendaciones;
  }

  private async recomendarDeportes(userId: number, perfil: UserProfile): Promise<RecommendationScore[]> {
    const recomendaciones: RecommendationScore[] = [];
    const deportes = await this.prisma.deportes_equipamiento.findMany({ include: { items: true, deporte_tipos: true }, take: 4 });
    deportes.forEach(d => {
      if (perfil.historial.vistos.has(d.item_id)) return;
      recomendaciones.push({ tipo: 'deporte', itemId: d.item_id, score: 60 + perfil.interes.deportes * 5, razon: ['Para tu entrenamiento'], item: d });
    });
    return recomendaciones;
  }

  private async aplicarCollaborativeFiltering(userId: number, recomendacionesExistentes: RecommendationScore[]): Promise<RecommendationScore[]> {
    try {
      const usuariosSimilares = await this.encontrarUsuariosSimilares(userId);
      if (usuariosSimilares.length === 0) return [];
      const recomendacionesColaborativas: RecommendationScore[] = [];
      for (const usuarioSimilar of usuariosSimilares.slice(0, 5)) {
        const actividadesSimilares = await this.prisma.userActivity.findMany({
          where: { usuarioId: usuarioSimilar.id, tipo: { in: ['RECETA_VISTA', 'CELULAR_VISTO', 'TORTA_VISTA', 'LUGAR_VISTO', 'DEPORTE_VISTO'] }, fecha: { gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) } }, take: 10, orderBy: { fecha: 'desc' }
        });
        for (const actividad of actividadesSimilares) {
          const yaVisto = await this.prisma.userActivity.findFirst({ where: { usuarioId: userId, referenciaId: actividad.referenciaId, referenciaTipo: actividad.referenciaTipo } });
          if (!yaVisto && !recomendacionesExistentes.some(r => r.itemId === actividad.referenciaId) && actividad.referenciaId) {
            const tipoItem = this.mapearTipoActividad(actividad.tipo);
            if (tipoItem) recomendacionesColaborativas.push({ tipo: tipoItem, itemId: actividad.referenciaId, score: 60 + (usuarioSimilar.similaridad * 20), razon: [`Similar a otros`] });
          }
        }
      }
      return recomendacionesColaborativas.slice(0, 6);
    } catch (e) { return []; }
  }

  private async encontrarUsuariosSimilares(userId: number): Promise<UsuarioSimilar[]> {
    return []; // Placeholder
  }

  private mapearTipoActividad(tipo: string): string | null {
    const mapping: any = { 'RECETA_VISTA': 'receta', 'CELULAR_VISTO': 'celular', 'TORTA_VISTA': 'torta', 'LUGAR_VISTO': 'lugar', 'DEPORTE_VISTO': 'deporte' };
    return mapping[tipo] || null;
  }

  private async obtenerDetallesRecomendaciones(recomendaciones: RecommendationScore[]): Promise<any[]> {
    return recomendaciones.map((rec) => ({
      tipo: rec.tipo, itemId: rec.itemId, score: rec.score, razon: rec.razon, item: this.formatearItem(rec.item, rec.tipo),
    }));
  }

  public formatearItem(item: any, tipo: string): any {
    if (!item) return null;
    // ... Implementación del switch ...
    switch (tipo) {
      case 'receta': return { id: item.id, nombre: item.nombre, descripcion: item.descripcion, imagenPrincipal: item.imagenPrincipal, tiempoTotal: item.tiempoTotal, dificultad: item.dificultad?.nivel, categoria: item.categoria?.nombre, calificacionPromedio: item.calificacionPromedio };
      case 'celular': return { id: item.item_id, nombre: item.items?.nombre, descripcion: item.items?.descripcion, imagenPrincipal: item.items?.imagen_principal_url, marca: item.celular_marcas?.nombre, modelo: item.modelo, gama: item.celular_gamas?.gama, ram: item.memoria_ram_gb, almacenamiento: item.almacenamiento_interno_gb };
      case 'torta': return { id: item.item_id, nombre: item.items?.nombre, descripcion: item.items?.descripcion, imagenPrincipal: item.items?.imagen_principal_url, sabor: item.torta_sabores?.nombre, cobertura: item.torta_coberturas?.nombre };
      case 'lugar': return { id: item.item_id, nombre: item.items?.nombre, descripcion: item.items?.descripcion, imagenPrincipal: item.items?.imagen_principal_url, tipo: item.lugar_tipos?.nombre, ciudad: item.ciudad, direccion: item.direccion };
      case 'deporte': return { id: item.item_id, nombre: item.items?.nombre, descripcion: item.items?.descripcion, imagenPrincipal: item.items?.imagen_principal_url, marca: item.deporte_marcas?.nombre, tipo: item.deporte_tipos?.nombre };
      case 'laptop': return { id: item.item_id, nombre: item.items?.nombre, descripcion: item.items?.descripcion, imagenPrincipal: item.items?.imagen_principal_url, marca: item.laptop_marcas?.nombre, procesador: item.laptop_procesadores?.nombre, ram: item.memoria_ram_gb, almacenamiento: item.almacenamiento_gb, pantalla: item.pantalla_pulgadas };
      case 'accesorio': return { id: item.item_id, nombre: item.items?.nombre, descripcion: item.items?.descripcion, imagenPrincipal: item.items?.imagen_principal_url, marca: item.accesorio_marcas?.nombre, tipo: item.accesorio_tipos?.nombre, modeloCompatible: item.modelo_compatible };
      case 'producto': return { id: item.item_id, nombre: item.nombre, descripcion: item.descripcion, imagenPrincipal: item.imagen_principal_url, precio: item.precio };
      default: return item;
    }
  }

  async getRecommendationStats(userId: number): Promise<any> {
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() - 90);
    const actividades = await this.prisma.userActivity.findMany({ where: { usuarioId: userId, fecha: { gte: fechaLimite }, esActivo: true } });
    const perfil = await this.construirPerfilUsuario(userId, actividades);
    return {
      totalInteracciones: actividades.length,
      interaccionesPorCategoria: {
        recetas: Math.round(perfil.interes.recetas), celular: Math.round(perfil.interes.celulares),
        laptops: Math.round(perfil.interes.laptops), accesorios: Math.round(perfil.interes.accesorios),
        tortas: Math.round(perfil.interes.tortas), lugares: Math.round(perfil.interes.lugares), deportes: Math.round(perfil.interes.deportes)
      },
      preferencias: { precioPromedio: 0, marcasFavoritas: [] }
    };
  }
}
