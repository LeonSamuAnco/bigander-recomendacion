const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkCategories() {
    try {
        const categories = await prisma.productCategory.findMany();
        console.log('Categorías existentes:');
        categories.forEach(c => console.log(`${c.id}: ${c.nombre}`));
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}
checkCategories();
