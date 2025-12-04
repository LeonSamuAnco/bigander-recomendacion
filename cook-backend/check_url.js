const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkFullUrl() {
    try {
        const product = await prisma.product.findFirst({
            where: { id: 35 },
            select: { id: true, nombre: true, imagenUrl: true }
        });

        if (product) {
            console.log('Producto ID:', product.id);
            console.log('Nombre:', product.nombre);
            console.log('URL Completa:', product.imagenUrl);
            console.log('Longitud URL:', product.imagenUrl?.length || 0);
        } else {
            console.log('Producto no encontrado');
        }
    } catch (e) {
        console.error('Error:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}
checkFullUrl();
