
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUser() {
    try {
        const userId = 15;
        console.log(`🔍 Verificando usuario ID: ${userId}`);

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { vendedor: true }
        });

        if (!user) {
            console.log('❌ Usuario no encontrado');
            return;
        }

        console.log('✅ Usuario encontrado:', user.nombres, user.apellidos);

        if (user.vendedor) {
            console.log('✅ Perfil de vendedor encontrado:', user.vendedor);
        } else {
            console.log('❌ EL USUARIO NO TIENE PERFIL DE VENDEDOR');
            console.log('⚠️ Intentando crear perfil de vendedor...');

            try {
                const newVendor = await prisma.vendor.create({
                    data: {
                        usuarioId: userId,
                        nombreTienda: `Tienda de ${user.nombres}`,
                        descripcion: 'Tienda creada automáticamente',
                        esVerificado: true
                    }
                });
                console.log('✅ Perfil de vendedor creado exitosamente:', newVendor);
            } catch (e) {
                console.error('❌ Error al crear perfil de vendedor:', e);
            }
        }

        // Verificar categorías
        const categories = await prisma.productCategory.findMany();
        console.log('📦 Categorías existentes:', categories);

        if (categories.length === 0) {
            console.log('⚠️ No hay categorías, creando categoría por defecto...');
            await prisma.productCategory.create({
                data: {
                    nombre: 'General',
                    descripcion: 'Categoría general',
                    esActivo: true
                }
            });
            console.log('✅ Categoría creada');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkUser();
