const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkProducts() {
    try {
        const products = await prisma.product.findMany({
            orderBy: { id: 'desc' },
            take: 5,
            select: {
                id: true,
                nombre: true,
                imagenUrl: true
            }
        });

        console.log('Últimos 5 productos:');
        products.forEach(p => {
            console.log(`ID: ${p.id} | Nombre: ${p.nombre}`);
            console.log(`  Imagen: ${p.imagenUrl || '(sin imagen)'}`);
        });
    } catch (e) {
        console.error('Error:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}
checkProducts();
