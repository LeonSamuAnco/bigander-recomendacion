const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testPrismaWithData() {
  try {
    console.log('🔍 Probando Prisma con datos reales...\n');
    
    // 1. Probar roles
    console.log('1️⃣ Probando roles...');
    const roles = await prisma.role.findMany();
    console.log(`✅ Roles encontrados: ${roles.length}`);
    roles.forEach(role => {
      console.log(`   🔐 ${role.codigo}: ${role.nombre}`);
    });
    
    // 2. Probar tipos de documento
    console.log('\n2️⃣ Probando tipos de documento...');
    const documentTypes = await prisma.documentType.findMany();
    console.log(`✅ Tipos de documento: ${documentTypes.length}`);
    documentTypes.forEach(doc => {
      console.log(`   📄 ${doc.codigo}: ${doc.nombre}`);
    });
    
    // 3. Probar usuarios
    console.log('\n3️⃣ Probando usuarios...');
    const users = await prisma.user.findMany({
      take: 5,
      include: {
        rol: true,
        tipoDocumento: true,
      }
    });
    console.log(`✅ Usuarios encontrados: ${users.length}`);
    users.forEach(user => {
      console.log(`   👤 ${user.nombres} ${user.apellidos} (${user.rol.codigo})`);
    });
    
    // 4. Probar clientes
    console.log('\n4️⃣ Probando clientes...');
    const clients = await prisma.client.findMany({
      include: {
        usuario: {
          include: {
            rol: true
          }
        }
      }
    });
    console.log(`✅ Clientes encontrados: ${clients.length}`);
    clients.forEach(client => {
      console.log(`   🛒 Cliente: ${client.usuario.nombres} ${client.usuario.apellidos}`);
      console.log(`      Nivel: ${client.nivelCliente}, Puntos: ${client.puntosFidelidad}`);
    });
    
    // 5. Probar planes de cliente
    console.log('\n5️⃣ Probando planes de cliente...');
    const plans = await prisma.clientPlan.findMany();
    console.log(`✅ Planes encontrados: ${plans.length}`);
    plans.forEach(plan => {
      console.log(`   📋 ${plan.codigo}: ${plan.nombre} - $${plan.precioMensual}`);
    });
    
    console.log('\n🎉 ¡Prisma funciona perfectamente con todos los datos!');
    console.log('\n🌐 Prisma Studio disponible en: http://localhost:5555');
    console.log('📊 Puedes explorar todos tus datos visualmente');
    
  } catch (error) {
    console.error('❌ Error en Prisma:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

testPrismaWithData();
