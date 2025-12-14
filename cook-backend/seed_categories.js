const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function initCategories() {
    const categories = [
        // G1: Tecnología y Negocios
        { nombre: 'Celulares y Smartphones', descripcion: 'Venta directa de equipos móviles' },
        { nombre: 'Laptops y Cómputo', descripcion: 'Equipos de cómputo y portátiles' },
        { nombre: 'Accesorios y Periféricos', descripcion: 'Cargadores, fundas, audífonos, etc.' },

        // G2: Estilo de Vida y Hogar
        { nombre: 'Tortas y Celebraciones', descripcion: 'Tortas personalizadas y eventos' },
        { nombre: 'Recetas y Cocina', descripcion: 'Recetas, utensilios e insumos de cocina' },
        { nombre: 'Lugares y Servicios', descripcion: 'Recomendaciones de locales y servicios' },
        { nombre: 'Deportes y Bienestar', descripcion: 'Equipamiento deportivo y salud' }
    ];

    console.log('Actualizando categorías...');

    for (const cat of categories) {
        // Buscar si existe por nombre exacto o similar
        const existing = await prisma.productCategory.findFirst({
            where: { nombre: { contains: cat.nombre.split(' ')[0] } } // Búsqueda laxa
        });

        if (existing) {
            console.log(`Actualizando ${existing.nombre} -> ${cat.nombre}`);
            await prisma.productCategory.update({
                where: { id: existing.id },
                data: {
                    nombre: cat.nombre,
                    descripcion: cat.descripcion
                }
            });
        } else {
            console.log(`Creando ${cat.nombre}`);
            await prisma.productCategory.create({
                data: cat
            });
        }
    }
}

initCategories()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
