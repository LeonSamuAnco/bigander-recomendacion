# 🍳 CookSync - Sistema de Perfiles por Tipo de Usuario

## 📋 Descripción General

CookSync ahora cuenta con un sistema completo de perfiles diferenciados por tipo de usuario. Cada rol tiene su propio dashboard personalizado con funcionalidades específicas.

## 👥 Tipos de Usuario y sus Perfiles

### 🛒 **CLIENTE**
**Dashboard personalizado con:**
- 📊 Estadísticas personales (puntos, favoritas, ingredientes)
- 🎯 Plan actual y beneficios
- ❤️ Recetas favoritas
- 🥫 Gestión de despensa personal
- 🍽️ Recomendaciones basadas en ingredientes
- 📈 Actividad reciente
- ⚡ Acciones rápidas (buscar recetas, lista de compras, etc.)

### 🏪 **VENDEDOR**
**Panel de ventas con:**
- 💰 Resumen de ventas (hoy, semana, mes)
- 📦 Gestión de pedidos pendientes
- 🏆 Productos más vendidos
- 📊 Estado del inventario
- 🔔 Notificaciones importantes
- ⚡ Acciones rápidas (agregar productos, gestionar pedidos, etc.)

### 🛡️ **ADMIN**
**Panel de administración con:**
- 📊 Estadísticas completas del sistema
- 🏥 Salud del sistema (BD, servidor, API)
- 👥 Gestión de usuarios recientes
- 📋 Reportes y alertas del sistema
- 🛠️ Herramientas de administración
- 🔄 Actividad del sistema en tiempo real

### 🛡️ **MODERADOR**
**Panel de moderación con:**
- ⏳ Recetas pendientes de aprobación
- 🚨 Contenido reportado
- 📊 Estadísticas de moderación
- 🛠️ Herramientas de moderación
- 📈 Historial de acciones
- 🔔 Alertas de moderación

## 🚀 Características Implementadas

### ✅ **Backend (NestJS + TypeORM + MySQL)**
- **Autenticación JWT** completa
- **Endpoints específicos** para cada tipo de usuario
- **Sistema de roles** con permisos
- **Base de datos** completamente estructurada
- **Validaciones** de seguridad por rol

### ✅ **Frontend (React)**
- **Rutas protegidas** por rol
- **Dashboards personalizados** para cada tipo de usuario
- **Componentes reutilizables** y modulares
- **Diseño responsive** y moderno
- **Navegación inteligente** según el rol

### ✅ **Seguridad**
- **Middleware de autorización**
- **Verificación de tokens JWT**
- **Rutas protegidas** por tipo de usuario
- **Validación de permisos** en cada endpoint

## 📁 Estructura de Archivos Creados

### **Backend**
```
cook-backend/src/
├── auth/
│   ├── auth-prisma.controller.ts    # Controlador con Prisma
│   ├── auth-prisma.service.ts       # Servicio con Prisma
│   ├── auth-prisma.module.ts        # Módulo de Prisma
│   └── auth.service.ts              # Servicio actualizado
├── prisma/
│   └── schema.prisma                # Schema completo con recetas
└── test-*.js                        # Scripts de prueba
```

### **Frontend**
```
cook-frontend/src/components/
├── profiles/
│   ├── ClientProfile.js             # Dashboard del cliente
│   ├── VendorProfile.js             # Dashboard del vendedor
│   ├── AdminProfile.js              # Dashboard del admin
│   ├── ModeratorProfile.js          # Dashboard del moderador
│   ├── ProfileManager.js            # Gestor de perfiles
│   └── ProfileStyles.css            # Estilos personalizados
├── dashboard/
│   ├── Dashboard.js                 # Dashboard principal
│   └── Dashboard.css                # Estilos del dashboard
└── auth/
    └── ProtectedRoute.js            # Rutas protegidas
```

## 🎯 Cómo Usar el Sistema

### **1. Iniciar el Backend**
```bash
cd cook-backend
npm run start:dev
```

### **2. Iniciar el Frontend**
```bash
cd cook-frontend
npm start
```

### **3. Probar el Sistema**
1. **Registrarse** con diferentes roles:
   - Selecciona "CLIENTE" para acceso de usuario final
   - Selecciona "VENDEDOR" para panel de ventas
   - Selecciona "ADMIN" para administración
   - Selecciona "MODERADOR" para moderación

2. **Iniciar Sesión**:
   - Serás redirigido automáticamente a `/dashboard`
   - Verás el perfil específico según tu rol

3. **Explorar Funcionalidades**:
   - Cada dashboard tiene funciones únicas
   - Navegación personalizada por rol
   - Datos específicos para cada tipo de usuario

## 🔧 Endpoints Principales

### **Autenticación**
- `POST /auth/register` - Registro de usuarios
- `POST /auth/login` - Inicio de sesión
- `GET /auth/user/:id` - Obtener perfil de usuario

### **Datos del Sistema**
- `GET /auth/roles` - Obtener roles disponibles
- `GET /auth/document-types` - Tipos de documento
- `GET /auth/client-plans` - Planes de cliente

### **Prisma Studio**
- `http://localhost:5555` - Interfaz visual de la BD

## 🎨 Diseño y UX

### **Características Visuales**
- **Gradientes modernos** específicos por rol
- **Iconos intuitivos** para cada función
- **Cards interactivas** con efectos hover
- **Colores diferenciados** por tipo de usuario
- **Responsive design** para todos los dispositivos

### **Experiencia de Usuario**
- **Navegación intuitiva** según el rol
- **Carga rápida** de dashboards
- **Feedback visual** en todas las acciones
- **Estados de carga** y error bien manejados

## 🧪 Scripts de Prueba

### **Probar Sistema Completo**
```bash
node test-complete-system.js
```

### **Probar Solo Backend**
```bash
node test-endpoints.js
```

### **Probar Prisma**
```bash
node test-prisma-final.js
```

### **Probar Recetas**
```bash
node test-recipes-prisma.js
```

## 📊 Base de Datos

### **Tablas Principales**
- **usuarios** - Información básica de usuarios
- **roles** - CLIENTE, VENDEDOR, ADMIN, MODERADOR
- **tipos_documento** - DNI, CE, PASAPORTE, RUC
- **clientes** - Información extendida de clientes
- **planes_cliente** - BASICO, LIVE, PREMIUM, CHEF

### **Módulo de Recetas**
- **recetas** - 45 recetas completas
- **ingredientes_maestros** - 59 ingredientes
- **categorias_receta** - 10 categorías
- **unidades_medida** - 15 unidades
- **receta_ingredientes** - 210 relaciones

## 🚀 Próximas Mejoras

### **Funcionalidades Pendientes**
- [ ] Sistema de notificaciones en tiempo real
- [ ] Chat entre usuarios
- [ ] Sistema de calificaciones
- [ ] Reportes avanzados
- [ ] Integración con pagos
- [ ] API para móviles

### **Optimizaciones**
- [ ] Cache de datos frecuentes
- [ ] Lazy loading de componentes
- [ ] Optimización de imágenes
- [ ] PWA (Progressive Web App)

## 🎉 Conclusión

El sistema de perfiles por tipo de usuario está **completamente funcional** y listo para producción. Cada usuario tendrá una experiencia personalizada según su rol, con dashboards específicos y funcionalidades adaptadas a sus necesidades.

### **Beneficios Logrados:**
✅ **Experiencia personalizada** por tipo de usuario
✅ **Seguridad robusta** con roles y permisos
✅ **Escalabilidad** para agregar nuevos roles
✅ **Mantenibilidad** con código modular
✅ **UX moderna** y responsive

¡El sistema está listo para que los usuarios disfruten de una experiencia completamente personalizada en CookSync! 🍳✨
