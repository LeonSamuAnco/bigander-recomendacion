const mysql = require('mysql2/promise');
const fs = require('fs').promises;

async function fixDatabase() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'cook',
    multipleStatements: true
  });

  try {
    console.log('🔧 Corrigiendo configuración de base de datos...\n');
    
    // 1. Verificar y corregir AUTO_INCREMENT en tabla clientes
    console.log('1️⃣ Configurando AUTO_INCREMENT en tabla clientes...');
    try {
      await connection.execute(`
        ALTER TABLE clientes 
        MODIFY COLUMN id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY
      `);
      console.log('✅ AUTO_INCREMENT configurado correctamente');
    } catch (error) {
      if (error.message.includes('Multiple primary key')) {
        console.log('ℹ️ PRIMARY KEY ya existe');
      } else {
        console.log('⚠️ Error configurando AUTO_INCREMENT:', error.message);
      }
    }

    // 2. Crear clientes para usuarios existentes
    console.log('\n2️⃣ Creando registros de clientes faltantes...');
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

    // 3. Verificar estadísticas
    console.log('\n3️⃣ Verificando estadísticas...');
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
        'Usuarios CLIENTE con registro' as descripcion, 
        COUNT(*) as cantidad 
      FROM usuarios u
      INNER JOIN clientes c ON u.id = c.usuario_id
      WHERE u.rol_id = 1
    `);
    
    stats.forEach(row => {
      console.log(`📊 ${row.descripcion}: ${row.cantidad}`);
    });

    // 4. Verificar estructura de tabla
    console.log('\n4️⃣ Verificando estructura de tabla clientes...');
    const [structure] = await connection.execute('DESCRIBE clientes');
    console.log('📋 Estructura de tabla clientes:');
    structure.forEach(col => {
      console.log(`   ${col.Field}: ${col.Type} ${col.Key ? `(${col.Key})` : ''} ${col.Extra}`);
    });

    console.log('\n🎉 ¡Base de datos corregida exitosamente!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
  }
}

fixDatabase();
