const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
    try {
        const product = await prisma.product.create({
            data: {
                nombre: 'Test ' + Date.now(),
                descripcion: 'Descripcion',
                precio: 10.00,
                stock: 5,
                categoriaId: 23,  // Usando categoria conocida del debug anterior
                vendedorId: 1,    // Usando vendedor 1
                sku: null,
                esActivo: true,
            }
        });
        console.log('OK - ID:', product.id);
    } catch (e) {
        console.log('ERROR:', e.code, e.message);
        if (e.meta) console.log('META:', JSON.stringify(e.meta));
    } finally {
        await prisma.$disconnect();
    }
}
test();
