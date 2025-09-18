const axios = require('axios');

async function testRegister() {
  const baseURL = 'http://localhost:3002';
  
  console.log('🧪 Probando registro de usuario...\n');
  
  try {
    // 1. Primero obtener roles y tipos de documento
    console.log('1️⃣ Obteniendo roles...');
    const rolesResponse = await axios.get(`${baseURL}/auth/roles`);
    console.log(`✅ Roles disponibles: ${rolesResponse.data.length}`);
    rolesResponse.data.forEach(role => {
      console.log(`   🔐 ID: ${role.id}, Código: ${role.codigo}, Nombre: ${role.nombre}`);
    });
    
    console.log('\n2️⃣ Obteniendo tipos de documento...');
    const docTypesResponse = await axios.get(`${baseURL}/auth/document-types`);
    console.log(`✅ Tipos de documento disponibles: ${docTypesResponse.data.length}`);
    docTypesResponse.data.forEach(docType => {
      console.log(`   📄 ID: ${docType.id}, Código: ${docType.codigo}, Nombre: ${docType.nombre}`);
    });
    
    // 2. Intentar registrar un usuario de prueba
    console.log('\n3️⃣ Intentando registrar usuario de prueba...');
    const testUser = {
      nombres: 'Usuario',
      apellidos: 'De Prueba',
      email: `test_${Date.now()}@example.com`,
      password: 'password123',
      tipoDocumentoId: docTypesResponse.data[0].id, // Primer tipo de documento
      numeroDocumento: `${Math.floor(Math.random() * 100000000)}`,
      telefono: '999888777',
      fechaNacimiento: '1990-01-01',
      genero: 'M',
      rolId: 1, // Cliente
      aceptaTerminos: true,
      aceptaMarketing: false
    };
    
    console.log('📋 Datos del usuario de prueba:', {
      nombres: testUser.nombres,
      apellidos: testUser.apellidos,
      email: testUser.email,
      tipoDocumentoId: testUser.tipoDocumentoId,
      numeroDocumento: testUser.numeroDocumento,
      rolId: testUser.rolId
    });
    
    const registerResponse = await axios.post(`${baseURL}/auth/register`, testUser);
    console.log('✅ Usuario registrado exitosamente!');
    console.log('📊 Respuesta:', {
      message: registerResponse.data.message,
      userId: registerResponse.data.user?.id,
      clientId: registerResponse.data.client?.id
    });
    
    console.log('\n🎉 ¡Registro funcionando correctamente!');
    console.log('💡 Ahora puedes usar el formulario del frontend sin problemas.');
    
  } catch (error) {
    console.error('❌ Error en el test:', error.message);
    if (error.response) {
      console.error('📊 Status:', error.response.status);
      console.error('📋 Data:', error.response.data);
    }
  }
}

testRegister();
