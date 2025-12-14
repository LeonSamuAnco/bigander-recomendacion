const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixAccesorios() {
    const acc = await prisma.productCategory.findFirst({
        where: { nombre: { contains: 'Accesorios' } }
    });

    if (!acc) {
        console.log('Creando Accesorios...');
        await prisma.productCategory.create({
            data: { nombre: 'Accesorios y Periféricos', descripcion: 'Tecnología' }
        });
    } else {
        console.log('Accesorios ya existe:', acc.id, acc.nombre);
    }

    // Eliminar Juguetes si existe
    try {
        const juguetes = await prisma.productCategory.findFirst({ where: { nombre: 'Juguetes' } });
        if (juguetes) {
            // Renombrar a Accesorios si no queremos borrar IDs
            // await prisma.productCategory.update({ where: { id: juguetes.id }, data: { nombre: 'Accesorios y Periféricos' }});
            // Mejor borrarlo o dejarlo inactivo
            console.log('Juguetes existe ID:', juguetes.id);
        }
    } catch (e) { }
}

fixAccesorios().finally(() => prisma.$disconnect());
