const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixSKUs() {
    try {
        // Buscar productos con SKU vacío
        const productsWithEmptySKU = await prisma.product.findMany({
            where: {
                sku: ''
            }
        });

        console.log(`Encontrados ${productsWithEmptySKU.length} productos con SKU vacío`);

        // Actualizar todos a null
        if (productsWithEmptySKU.length > 0) {
            const result = await prisma.product.updateMany({
                where: {
                    sku: ''
                },
                data: {
                    sku: null
                }
            });
            console.log(`Actualizados ${result.count} productos: SKU vacío -> null`);
        }

        console.log('✅ Listo! Ahora puedes crear productos sin SKU duplicado.');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

fixSKUs();
