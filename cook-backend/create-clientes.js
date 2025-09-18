const mysql = require('mysql2/promise');

async function createClientesTable() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'cook'
  });

  try {
    console.log('🔧 Creando tabla clientes...\n');
    
    // Crear tabla clientes
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS clientes (
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
        UNIQUE KEY uk_cliente_usuario (usuario_id),
        KEY fk_clientes_plan (plan_cliente_id),
        CONSTRAINT fk_clientes_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE,
        CONSTRAINT fk_clientes_plan FOREIGN KEY (plan_cliente_id) REFERENCES planes_cliente (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Tabla clientes creada exitosamente');

    // Verificar que las tablas relacionadas existen
    console.log('\n🔍 Verificando tablas relacionadas...');
    const tables = ['usuarios', 'planes_cliente', 'roles', 'tipos_documento'];
    
    for (const table of tables) {
      try {
        const [result] = await connection.execute(`SELECT COUNT(*) as count FROM ${table}`);
        console.log(`✅ ${table}: ${result[0].count} registros`);
      } catch (error) {
        console.log(`❌ ${table}: NO EXISTE`);
      }
    }

    // Crear clientes para usuarios existentes con rol CLIENTE
    console.log('\n👥 Creando registros de clientes para usuarios existentes...');
    const [result] = await connection.execute(`
      INSERT IGNORE INTO clientes (
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
      LEFT JOIN clientes c ON u.id = c.usuario_id
      WHERE c.usuario_id IS NULL 
        AND u.rol_id = 1
    `);
    console.log(`✅ ${result.affectedRows} clientes creados`);

    // Mostrar estadísticas finales
    console.log('\n📊 Estadísticas finales:');
    const [stats] = await connection.execute(`
      SELECT 
        'Total usuarios' as descripcion, 
        COUNT(*) as cantidad 
      FROM usuarios
      UNION ALL
      SELECT 
        'Total clientes' as descripcion, 
        COUNT(*) as cantidad 
      FROM clientes
      UNION ALL
      SELECT 
        'Usuarios con rol CLIENTE' as descripcion, 
        COUNT(*) as cantidad 
      FROM usuarios u
      INNER JOIN roles r ON u.rol_id = r.id
      WHERE r.codigo = 'CLIENTE'
    `);
    
    stats.forEach(row => {
      console.log(`   ${row.descripcion}: ${row.cantidad}`);
    });

    console.log('\n🎉 ¡Tabla clientes configurada exitosamente!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await connection.end();
  }
}

createClientesTable();
