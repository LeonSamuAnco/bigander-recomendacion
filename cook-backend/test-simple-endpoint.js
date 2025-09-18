const axios = require('axios');

async function testSimpleEndpoint() {
  const baseURL = 'http://localhost:3002';
  
  console.log('🧪 Probando endpoint simple...\n');
  
  try {
    // Probar si el servidor responde
    console.log('1️⃣ Verificando servidor...');
    const healthResponse = await axios.get(`${baseURL}/auth/test-db`);
    console.log('✅ Servidor funcionando');
    
    // Probar endpoint de roles
    console.log('2️⃣ Probando roles...');
    const rolesResponse = await axios.get(`${baseURL}/auth/roles`);
    console.log('✅ Roles obtenidos:', rolesResponse.data.length);
    
    // Usar un ID de usuario existente (asumiendo que existe el ID 1)
    console.log('3️⃣ Probando getUserById con ID 1...');
    try {
      const userResponse = await axios.get(`${baseURL}/auth/user/1`);
      console.log('✅ Usuario obtenido:');
      console.log('📄 Respuesta:', JSON.stringify(userResponse.data, null, 2));
    } catch (error) {
      console.log('⚠️ Usuario ID 1 no existe o error:', error.response?.data?.message || error.message);
    }
    
    // Probar con diferentes IDs
    for (let i = 1; i <= 5; i++) {
      try {
        console.log(`\n4️⃣ Probando con ID ${i}...`);
        const userResponse = await axios.get(`${baseURL}/auth/user/${i}`);
        if (userResponse.data.user) {
          console.log(`✅ Usuario ${i} encontrado:`);
          console.log(`   Nombre: ${userResponse.data.user.nombres} ${userResponse.data.user.apellidos}`);
          console.log(`   Email: ${userResponse.data.user.email}`);
          console.log(`   Rol: ${userResponse.data.user.role ? userResponse.data.user.role.nombre : 'Sin rol'}`);
          console.log(`   Tipo Doc: ${userResponse.data.user.documentType ? userResponse.data.user.documentType.nombre : 'Sin tipo doc'}`);
          break; // Si encontramos uno, salimos del loop
        }
      } catch (error) {
        console.log(`   ❌ Usuario ${i} no encontrado`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

testSimpleEndpoint();
