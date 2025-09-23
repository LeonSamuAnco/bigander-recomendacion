/**
 * Script para limpiar localStorage corrupto
 * Ejecutar en la consola del navegador si hay problemas con tokens
 */

// Función para limpiar todo el localStorage
window.clearCookSyncStorage = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  localStorage.removeItem('userRole');
  console.log('✅ CookSync localStorage limpiado');
  window.location.reload();
};

// Función para ver qué hay en localStorage
window.debugCookSyncStorage = () => {
  console.log('🔍 Contenido del localStorage:');
  console.log('authToken:', localStorage.getItem('authToken'));
  console.log('user:', localStorage.getItem('user'));
  console.log('userRole:', localStorage.getItem('userRole'));
};

// Auto-ejecutar limpieza si hay tokens corruptos
const token = localStorage.getItem('authToken');
if (token && (!token.includes('.') || token.split('.').length !== 3)) {
  console.log('⚠️ Token corrupto detectado, limpiando...');
  window.clearCookSyncStorage();
}

console.log('🛠️ Utilidades de depuración cargadas:');
console.log('- clearCookSyncStorage() - Limpia todo el localStorage');
console.log('- debugCookSyncStorage() - Muestra el contenido del localStorage');
