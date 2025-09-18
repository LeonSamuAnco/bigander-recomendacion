const mysql = require('mysql2/promise');

async function checkTables() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'cook'
  });

  try {
    console.log('🔍 Verificando tablas en la base de datos...\n');
    
    // Obtener todas las tablas
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('📋 Tablas existentes:');
    tables.forEach((table, index) => {
      console.log(`${index + 1}. ${Object.values(table)[0]}`);
    });
    
    console.log('\n🔍 Verificando tablas específicas...');
    
    // Verificar tablas específicas
    const tablesToCheck = [
      'usuarios', 'roles', 'tipos_documento', 'planes_cliente', 
      'clientes', 'direcciones', 'recetas', 'ingredientes_maestros'
    ];
    
    for (const tableName of tablesToCheck) {
      try {
        const [result] = await connection.execute(`SELECT COUNT(*) as count FROM ${tableName}`);
        console.log(`✅ ${tableName}: ${result[0].count} registros`);
      } catch (error) {
        console.log(`❌ ${tableName}: NO EXISTE`);
      }
    }
    
    console.log('\n📊 Estadísticas de usuarios:');
    try {
      const [users] = await connection.execute(`
        SELECT 
          r.nombre as rol,
          COUNT(u.id) as cantidad
        FROM usuarios u
        LEFT JOIN roles r ON u.rol_id = r.id
        GROUP BY r.nombre
      `);
      users.forEach(row => {
        console.log(`👤 ${row.rol}: ${row.cantidad} usuarios`);
      });
    } catch (error) {
      console.log('❌ Error obteniendo estadísticas de usuarios');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
  }
}

checkTables();
