const axios = require('axios');

async function testEndpoints() {
  const baseURL = 'http://localhost:3002';
  
  console.log('🔍 Probando endpoints del backend...\n');
  
  try {
    // 1. Probar endpoint de roles
    console.log('1️⃣ Probando /auth/roles...');
    try {
      const rolesResponse = await axios.get(`${baseURL}/auth/roles`);
      console.log(`✅ Roles obtenidos: ${rolesResponse.data.length}`);
      rolesResponse.data.forEach(role => {
        console.log(`   🔐 ${role.codigo}: ${role.nombre}`);
      });
    } catch (error) {
      console.log(`❌ Error roles: ${error.message}`);
      if (error.response) {
        console.log(`   Status: ${error.response.status}`);
        console.log(`   Data: ${JSON.stringify(error.response.data)}`);
      }
    }
    
    // 2. Probar endpoint de tipos de documento
    console.log('\n2️⃣ Probando /auth/document-types...');
    try {
      const docTypesResponse = await axios.get(`${baseURL}/auth/document-types`);
      console.log(`✅ Tipos de documento obtenidos: ${docTypesResponse.data.length}`);
      docTypesResponse.data.forEach(docType => {
        console.log(`   📄 ${docType.codigo}: ${docType.nombre}`);
      });
    } catch (error) {
      console.log(`❌ Error tipos documento: ${error.message}`);
      if (error.response) {
        console.log(`   Status: ${error.response.status}`);
        console.log(`   Data: ${JSON.stringify(error.response.data)}`);
      }
    }
    
    // 3. Probar endpoint de planes de cliente
    console.log('\n3️⃣ Probando /auth/client-plans...');
    try {
      const plansResponse = await axios.get(`${baseURL}/auth/client-plans`);
      console.log(`✅ Planes de cliente obtenidos: ${plansResponse.data.length}`);
      plansResponse.data.forEach(plan => {
        console.log(`   📋 ${plan.codigo}: ${plan.nombre} - $${plan.precioMensual}`);
      });
    } catch (error) {
      console.log(`❌ Error planes: ${error.message}`);
      if (error.response) {
        console.log(`   Status: ${error.response.status}`);
      }
    }
    
    // 4. Verificar servidor
    console.log('\n4️⃣ Verificando servidor...');
    try {
      const healthResponse = await axios.get(`${baseURL}/`);
      console.log(`✅ Servidor respondiendo: ${healthResponse.status}`);
    } catch (error) {
      console.log(`❌ Servidor no responde: ${error.message}`);
    }
    
    console.log('\n📋 Resumen:');
    console.log('   - Si ves ✅ en todos los endpoints, el backend funciona correctamente');
    console.log('   - Si ves ❌, hay problemas de conexión o configuración');
    console.log('   - Verifica que el frontend esté apuntando a http://localhost:3002');
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

testEndpoints();
