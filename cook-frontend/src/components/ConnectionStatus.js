import React, { useState, useEffect } from 'react';
import { API_CONFIG } from '../config/api';

const ConnectionStatus = () => {
  const [status, setStatus] = useState({
    backend: 'checking',
    auth: 'checking',
    recipes: 'checking',
    admin: 'checking'
  });

  const checkConnection = async (endpoint, name) => {
    try {
      const response = await fetch(API_CONFIG.buildUrl(endpoint), {
        method: 'GET',
        headers: API_CONFIG.DEFAULT_HEADERS,
        signal: AbortSignal.timeout(5000) // 5 segundos timeout
      });
      
      if (response.ok) {
        setStatus(prev => ({ ...prev, [name]: 'connected' }));
        return true;
      } else {
        setStatus(prev => ({ ...prev, [name]: 'error' }));
        return false;
      }
    } catch (error) {
      console.error(`Connection check failed for ${name}:`, error);
      setStatus(prev => ({ ...prev, [name]: 'disconnected' }));
      return false;
    }
  };

  const runAllChecks = async () => {
    setStatus({
      backend: 'checking',
      auth: 'checking', 
      recipes: 'checking',
      admin: 'checking'
    });

    // Verificar backend básico
    await checkConnection('/', 'backend');
    
    // Verificar endpoint de recetas
    await checkConnection('/recipes', 'recipes');
    
    // Verificar endpoint de admin (sin auth)
    await checkConnection('/admin/test', 'admin');
    
    // Verificar auth (este puede fallar sin token)
    await checkConnection('/auth/user/1', 'auth');
  };

  useEffect(() => {
    runAllChecks();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getStatusIcon = (statusValue) => {
    switch (statusValue) {
      case 'connected': return '✅';
      case 'disconnected': return '❌';
      case 'error': return '⚠️';
      case 'checking': return '🔄';
      default: return '❓';
    }
  };

  const getStatusText = (statusValue) => {
    switch (statusValue) {
      case 'connected': return 'Conectado';
      case 'disconnected': return 'Desconectado';
      case 'error': return 'Error';
      case 'checking': return 'Verificando...';
      default: return 'Desconocido';
    }
  };

  const getStatusColor = (statusValue) => {
    switch (statusValue) {
      case 'connected': return '#10b981';
      case 'disconnected': return '#ef4444';
      case 'error': return '#f59e0b';
      case 'checking': return '#6b7280';
      default: return '#6b7280';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      padding: '16px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      zIndex: 1000,
      minWidth: '250px'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: '12px'
      }}>
        <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>
          Estado de Conexión
        </h4>
        <button 
          onClick={runAllChecks}
          style={{
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '4px 8px',
            fontSize: '12px',
            cursor: 'pointer'
          }}
        >
          🔄 Verificar
        </button>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {Object.entries(status).map(([service, statusValue]) => (
          <div key={service} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            fontSize: '13px'
          }}>
            <span style={{ textTransform: 'capitalize', fontWeight: '500' }}>
              {service === 'backend' ? 'Backend' : 
               service === 'auth' ? 'Autenticación' :
               service === 'recipes' ? 'Recetas' :
               service === 'admin' ? 'Admin' : service}:
            </span>
            <span style={{ 
              color: getStatusColor(statusValue),
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              {getStatusIcon(statusValue)} {getStatusText(statusValue)}
            </span>
          </div>
        ))}
      </div>
      
      <div style={{ 
        marginTop: '12px', 
        padding: '8px', 
        background: '#f3f4f6', 
        borderRadius: '6px',
        fontSize: '12px',
        color: '#6b7280'
      }}>
        <strong>Backend URL:</strong> {API_CONFIG.BASE_URL}
      </div>
    </div>
  );
};

export default ConnectionStatus;
