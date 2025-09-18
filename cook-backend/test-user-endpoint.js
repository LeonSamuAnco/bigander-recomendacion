const axios = require('axios');

async function testUserEndpoint() {
  const baseURL = 'http://localhost:3002';
  
  console.log('🧪 Probando endpoint getUserById...\n');
  
  try {
    // 1. Primero registrar un usuario de prueba
    console.log('1️⃣ Registrando usuario de prueba...');
    
    const testUser = {
      nombres: 'Test',
      apellidos: 'User',
      email: `test_${Date.now()}@test.com`,
      password: 'password123',
      tipoDocumentoId: 1,
      numeroDocumento: `${Math.floor(Math.random() * 100000000)}`,
      telefono: '999111222',
      fechaNacimiento: '1990-05-15',
      genero: 'M',
      rolId: 1, // CLIENTE
      aceptaTerminos: true,
      aceptaMarketing: false
    };
    
    const registerResponse = await axios.post(`${baseURL}/auth/register`, testUser);
    
    if (registerResponse.status !== 201) {
      console.log('❌ Error en registro');
      return;
    }
    
    console.log('✅ Usuario registrado exitosamente');
    console.log('📄 Respuesta de registro:', JSON.stringify(registerResponse.data, null, 2));
    
    // 2. Hacer login para obtener token
    console.log('\n2️⃣ Haciendo login...');
    
    const loginResponse = await axios.post(`${baseURL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    
    if (loginResponse.status !== 200) {
      console.log('❌ Error en login');
      return;
    }
    
    console.log('✅ Login exitoso');
    const token = loginResponse.data.access_token;
    const userId = loginResponse.data.user.id;
    
    console.log('🔑 Token obtenido');
    console.log('👤 User ID:', userId);
    console.log('📄 Respuesta de login:', JSON.stringify(loginResponse.data, null, 2));
    
    // 3. Probar el endpoint getUserById
    console.log('\n3️⃣ Probando endpoint getUserById...');
    
    const userResponse = await axios.get(`${baseURL}/auth/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Endpoint getUserById funciona');
    console.log('📄 Respuesta completa:', JSON.stringify(userResponse.data, null, 2));
    
    // 4. Verificar estructura de datos
    console.log('\n4️⃣ Verificando estructura de datos...');
    
    const userData = userResponse.data;
    
    console.log('🔍 Verificaciones:');
    console.log('   userData existe:', !!userData);
    console.log('   userData.user existe:', !!userData.user);
    console.log('   userData.user.rol existe:', !!userData.user?.rol);
    console.log('   userData.user.rol.codigo existe:', !!userData.user?.rol?.codigo);
    
    if (userData.user?.rol?.codigo) {
      console.log('   ✅ Rol código:', userData.user.rol.codigo);
      console.log('   ✅ Rol nombre:', userData.user.rol.nombre);
    } else {
      console.log('   ❌ Problema: rol no está cargado correctamente');
    }
    
    if (userData.user?.tipoDocumento) {
      console.log('   ✅ Tipo documento:', userData.user.tipoDocumento.nombre);
    } else {
      console.log('   ❌ Problema: tipoDocumento no está cargado');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testUserEndpoint();
