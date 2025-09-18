const mysql = require('mysql2/promise');

async function checkUserTables() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'cooksync'
    });

    console.log('🔍 Verificando dónde se guardan los usuarios...\n');

    // 1. Verificar tabla usuarios
    console.log('📋 TABLA: usuarios');
    const [usuarios] = await connection.execute('SELECT COUNT(*) as total FROM usuarios');
    console.log(`   Total usuarios: ${usuarios[0].total}`);
    
    if (usuarios[0].total > 0) {
      const [lastUsers] = await connection.execute(`
        SELECT id, nombres, apellidos, email, rol_id, created_at 
        FROM usuarios 
        ORDER BY created_at DESC 
        LIMIT 5
      `);
      console.log('   Últimos usuarios creados:');
      lastUsers.forEach(user => {
        const fecha = new Date(user.created_at).toLocaleString();
        console.log(`     ID: ${user.id} | ${user.nombres} ${user.apellidos} | ${user.email} | Rol: ${user.rol_id} | ${fecha}`);
      });
    }

    // 2. Verificar tabla clientes
    console.log('\n📋 TABLA: clientes');
    const [clientes] = await connection.execute('SELECT COUNT(*) as total FROM clientes');
    console.log(`   Total clientes: ${clientes[0].total}`);
    
    if (clientes[0].total > 0) {
      const [lastClients] = await connection.execute(`
        SELECT id, usuario_id, nivel_cliente, puntos_fidelidad, created_at 
        FROM clientes 
        ORDER BY created_at DESC 
        LIMIT 5
      `);
      console.log('   Últimos clientes creados:');
      lastClients.forEach(client => {
        const fecha = new Date(client.created_at).toLocaleString();
        console.log(`     ID: ${client.id} | Usuario ID: ${client.usuario_id} | Nivel: ${client.nivel_cliente} | Puntos: ${client.puntos_fidelidad} | ${fecha}`);
      });
    }

    // 3. Verificar usuarios con roles
    console.log('\n🔗 USUARIOS CON ROLES:');
    const [usersWithRoles] = await connection.execute(`
      SELECT u.id, u.nombres, u.apellidos, u.email, r.codigo, r.nombre as rol_nombre, u.created_at
      FROM usuarios u 
      JOIN roles r ON u.rol_id = r.id 
      ORDER BY u.created_at DESC 
      LIMIT 10
    `);
    
    if (usersWithRoles.length > 0) {
      usersWithRoles.forEach(user => {
        const fecha = new Date(user.created_at).toLocaleString();
        console.log(`   ${user.nombres} ${user.apellidos} (${user.email}) → ${user.codigo} (${user.rol_nombre}) | ${fecha}`);
      });
    } else {
      console.log('   No hay usuarios registrados aún');
    }

    // 4. Resumen de todas las tablas
    console.log('\n📊 RESUMEN DE TABLAS RELACIONADAS:');
    const tables = [
      'usuarios',
      'clientes', 
      'roles',
      'tipos_documento',
      'planes_cliente',
      'direcciones',
      'cliente_ingredientes',
      'cliente_recetas_favoritas'
    ];
    
    for (const table of tables) {
      try {
        const [count] = await connection.execute(`SELECT COUNT(*) as total FROM ${table}`);
        console.log(`   ${table.padEnd(25)}: ${count[0].total} registros`);
      } catch (error) {
        console.log(`   ${table.padEnd(25)}: ❌ Error - ${error.message}`);
      }
    }

    // 5. Verificar estructura de registro
    console.log('\n🏗️ FLUJO DE REGISTRO:');
    console.log('   1. Usuario se registra → se guarda en tabla "usuarios"');
    console.log('   2. Si el rol es CLIENTE → se crea registro en tabla "clientes"');
    console.log('   3. Se asigna rol desde tabla "roles"');
    console.log('   4. Se asigna tipo documento desde tabla "tipos_documento"');

    await connection.end();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkUserTables();
