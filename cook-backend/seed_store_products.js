const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedProducts() {
    console.log('Buscando vendedor...');
    let vendor = await prisma.vendor.findFirst();

    if (!vendor) {
        console.log('No hay vendedor, buscando usuario para crear uno...');
        let user = await prisma.usuario.findFirst();
        if (!user) {
            console.log('Creando usuario default...');
            user = await prisma.usuario.create({
                data: {
                    nombres: 'Vendedor Default',
                    email: 'vendedor@test.com',
                    password: 'hashed_password', // No importa para el seed
                    rol: 'VENDEDOR'
                }
            });
        }

        vendor = await prisma.vendor.create({
            data: {
                usuarioId: user.id,
                nombreTienda: 'Tienda Oficial',
                descripcion: 'Vendedor de prueba',
                esVerificado: true
            }
        });
    }

    console.log('Usando vendedor ID:', vendor.id);

    const products = [
        // Laptops (ID 55)
        {
            nombre: 'Laptop Gamer X1',
            descripcion: 'Potente laptop con RTX 4060 y i7 13th Gen',
            precio: 1200.00,
            stock: 10,
            categoryId: 55,
            imagenUrl: 'https://images.unsplash.com/photo-1603302576837-6378864aacd5?auto=format&fit=crop&q=80&w=500',
            esActivo: true
        },
        {
            nombre: 'Ultrabook Slim Pro',
            descripcion: 'Ligera y potente para trabajo, 16GB RAM',
            precio: 950.00,
            stock: 15,
            categoryId: 55,
            imagenUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=500',
            esActivo: true
        },

        // Accesorios (ID 56)
        {
            nombre: 'Audífonos Noise Cancelling',
            descripcion: 'Sonido premium con cancelación de ruido',
            precio: 150.00,
            stock: 50,
            categoryId: 56,
            imagenUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=500',
            esActivo: true
        },
        {
            nombre: 'Mouse Ergonómico Inalámbrico',
            descripcion: 'Cuida tu muñeca con este diseño vertical',
            precio: 45.00,
            stock: 30,
            categoryId: 56,
            imagenUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=500',
            esActivo: true
        },

        // Deportes (ID 19)
        {
            nombre: 'Balón de Fútbol Profesional',
            descripcion: 'Balón oficial talla 5',
            precio: 35.00,
            stock: 100,
            categoryId: 19,
            imagenUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80&w=500',
            esActivo: true
        },
        {
            nombre: 'Pesas Ajustables 20kg',
            descripcion: 'Set de mancuernas para casa',
            precio: 89.00,
            stock: 20,
            categoryId: 19,
            imagenUrl: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&q=80&w=500',
            esActivo: true
        }
    ];

    for (const p of products) {
        const existing = await prisma.product.findFirst({
            where: { nombre: p.nombre }
        });

        if (!existing) {
            await prisma.product.create({
                data: {
                    nombre: p.nombre,
                    descripcion: p.descripcion,
                    precio: p.precio,
                    stock: p.stock,
                    categoriaId: p.categoryId,
                    vendedorId: vendor.id,
                    imagenUrl: p.imagenUrl,
                    esActivo: p.esActivo
                }
            });
            console.log(`Creado: ${p.nombre}`);
        } else {
            console.log(`Ya existe: ${p.nombre}`);
        }
    }
}

seedProducts()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
