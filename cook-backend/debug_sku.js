const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function debug() {
    try {
        // Contar productos con sku vacío
        const emptySkuCount = await prisma.product.count({
            where: { sku: '' }
        });
        console.log('Productos con SKU vacio: ' + emptySkuCount);

        if (emptySkuCount > 0) {
            console.log('Eliminando SKUs vacios...');
            await prisma.product.updateMany({
                where: { sku: '' },
                data: { sku: null }
            });
            console.log('Listo!');
        }

        // Ver el schema del producto para saber nombre de campo correcto
        const product = await prisma.product.findFirst();
        if (product) {
            console.log('Campos del producto:', Object.keys(product));
        }

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

debug();
