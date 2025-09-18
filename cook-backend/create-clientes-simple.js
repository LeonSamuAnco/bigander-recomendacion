const mysql = require('mysql2/promise');

async function createClientesTableSimple() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'cook'
  });

  try {
    console.log('🔧 Creando tabla clientes (versión simple)...\n');
    
    // Primero eliminar la tabla si existe
    await connection.execute('DROP TABLE IF EXISTS clientes');
    console.log('🗑️ Tabla clientes eliminada (si existía)');
    
    // Crear tabla clientes sin restricciones foráneas
    await connection.execute(`
      CREATE TABLE clientes (
        id int(11) NOT NULL AUTO_INCREMENT,
        usuario_id int(11) NOT NULL,
        plan_cliente_id int(11) DEFAULT 1,
        fecha_registro date NOT NULL,
        fecha_inicio_plan date DEFAULT NULL,
        fecha_fin_plan date DEFAULT NULL,
        preferencias_notificacion longtext DEFAULT NULL,
        limite_credito decimal(10,2) DEFAULT 0.00,
        credito_usado decimal(10,2) DEFAULT 0.00,
        puntos_fidelidad int(11) DEFAULT 0,
        nivel_cliente enum('BRONCE','PLATA','ORO','PLATINO') DEFAULT 'BRONCE',
        descuento_personalizado decimal(5,2) DEFAULT 0.00,
        notas_internas text DEFAULT NULL,
        created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY uk_cliente_usuario (usuario_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Tabla clientes creada exitosamente');

    // Verificar tablas existentes
    console.log('\n🔍 Verificando tablas en la base de datos...');
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('📋 Tablas disponibles:');
    tables.forEach((table, index) => {
      console.log(`   ${index + 1}. ${Object.values(table)[0]}`);
    });

    // Verificar usuarios existentes
    console.log('\n👥 Verificando usuarios...');
    try {
      const [users] = await connection.execute(`
        SELECT 
          u.id, u.nombres, u.apellidos, u.rol_id,
          r.codigo as rol_codigo, r.nombre as rol_nombre
        FROM usuarios u
        LEFT JOIN roles r ON u.rol_id = r.id
        LIMIT 5
      `);
      
      console.log(`📊 Total usuarios encontrados: ${users.length}`);
      users.forEach(user => {
        console.log(`   👤 ${user.nombres} ${user.apellidos} (${user.rol_codigo || 'Sin rol'})`);
      });

      // Crear clientes para usuarios con rol CLIENTE (rol_id = 1)
      console.log('\n🏗️ Creando registros de clientes...');
      const [result] = await connection.execute(`
        INSERT INTO clientes (
          usuario_id, 
          plan_cliente_id, 
          fecha_registro, 
          puntos_fidelidad, 
          nivel_cliente, 
          limite_credito, 
          credito_usado, 
          descuento_personalizado
        )
        SELECT 
          u.id,
          1,
          CURDATE(),
          0,
          'BRONCE',
          0.00,
          0.00,
          0.00
        FROM usuarios u
        WHERE u.rol_id = 1
      `);
      console.log(`✅ ${result.affectedRows} clientes creados`);

    } catch (error) {
      console.log('⚠️ Error verificando usuarios:', error.message);
    }

    // Mostrar estadísticas finales
    console.log('\n📊 Estadísticas finales:');
    try {
      const [clientCount] = await connection.execute('SELECT COUNT(*) as count FROM clientes');
      console.log(`   📋 Total clientes: ${clientCount[0].count}`);
      
      const [userCount] = await connection.execute('SELECT COUNT(*) as count FROM usuarios');
      console.log(`   👥 Total usuarios: ${userCount[0].count}`);
    } catch (error) {
      console.log('⚠️ Error obteniendo estadísticas:', error.message);
    }

    console.log('\n🎉 ¡Tabla clientes configurada exitosamente!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
  }
}

createClientesTableSimple();
