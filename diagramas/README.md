# 📊 Diagramas UML Corregidos - CookSync

Este directorio contiene los diagramas UML actualizados que reflejan la implementación real del proyecto CookSync.

## 📁 Archivos Generados

### 1. **01_entidad_relacion_corregido.puml**
**Diagrama Entidad-Relación (Base de Datos)**

**Cambios principales:**
- ✅ Agregada tabla `items` como tabla central
- ✅ Agregadas tablas específicas: `celulares`, `tortas`, `lugares`, `deportes_equipamiento`
- ✅ Agregada tabla `favorites` con soporte multi-tipo
- ✅ Renombrada `Historial_Interaccion` → `user_activity`
- ✅ Agregadas tablas de metadatos: `celular_marcas`, `torta_sabores`, etc.
- ✅ Relaciones correctas usando `item_id` como FK

**Estructura clave:**
```
Items (tabla central)
  ├─ Celulares (item_id FK)
  ├─ Tortas (item_id FK)
  ├─ Lugares (item_id FK)
  └─ Deportes_Equipamiento (item_id FK)

Favorites
  ├─ tipo: ENUM (celular, torta, lugar, deporte, receta)
  └─ referenciaId: INT (apunta a item_id)
```

---

### 2. **02_componentes_corregido.puml**
**Diagrama de Componentes**

**Cambios principales:**
- ✅ Agregado `MLRecommendationsService` como componente principal
- ✅ Agregado `RecommendationsService` como fallback
- ✅ Agregado `FavoritesService`
- ✅ Agregados modelos: `UserVector`, `ItemVector`, `PredictionResult`
- ✅ Separación clara de capas: API → Servicios → Persistencia
- ✅ Relaciones con Redis, MySQL y Elasticsearch

**Componentes principales:**
- **MLRecommendationsService**: Motor de recomendaciones ML
- **FavoritesService**: Gestión de favoritos multi-tipo
- **AuthService**: Autenticación JWT
- **ProductsService**: CRUD de productos
- **UserActivityService**: Registro de actividades

---

### 3. **03_despliegue_corregido.puml**
**Diagrama de Despliegue**

**Cambios principales:**
- ✅ Estructura de nodos clara: Cliente → Nginx → App Server → Data Services
- ✅ Puertos especificados: 443 (HTTPS), 3002 (API), 3306 (MySQL), 6379 (Redis), 9200 (Elasticsearch)
- ✅ Servicios de datos agrupados
- ✅ Notas explicativas para cada capa

**Arquitectura:**
```
Navegador Web (HTTPS 443)
    ↓
Nginx (Reverse Proxy)
    ↓
Node.js + Nest.js (Puerto 3002)
    ↓
├─ MySQL (Puerto 3306)
├─ Redis (Puerto 6379)
└─ Elasticsearch (Puerto 9200)
```

---

### 4. **04_clases_sistema_recomendacion.puml**
**Diagrama de Clases - Sistema de Recomendación**

**Cambios principales:**
- ✅ Agregada clase `MLRecommendationsService` con todos sus métodos
- ✅ Agregada clase `FavoritesService` con métodos CRUD
- ✅ Agregadas clases de modelo: `UserVector`, `ItemVector`, `PredictionResult`
- ✅ Agregado enum `FavoriteType` con 7 tipos
- ✅ Relaciones entre servicios, modelos y entidades
- ✅ Notas explicativas sobre algoritmos

**Clases principales:**
- **MLRecommendationsService**: 
  - `buildUserVector()`: Construye vector de características del usuario
  - `buildItemVectors()`: Construye vectores de items candidatos
  - `calculateSimilarity()`: Similaridad coseno
  - `predictRating()`: Predicción de rating
  
- **FavoritesService**:
  - `create()`: Crear favorito
  - `enrichFavoritesData()`: Enriquecer con datos completos
  - `validateReference()`: Validar que el item existe

---

### 5. **05_actividad_recomendaciones_ml.puml**
**Diagrama de Actividad - Generación de Recomendaciones ML**

**Cambios principales:**
- ✅ Flujo completo desde solicitud hasta respuesta
- ✅ Verificación de caché en Redis
- ✅ Fallback para usuarios nuevos (Cold Start)
- ✅ 7 pasos del algoritmo ML:
  1. Construir Vector de Usuario
  2. Construir Vectores de Items
  3. Calcular Similaridad Coseno
  4. Predecir Rating
  5. Calcular Confianza
  6. Generar Explicación
  7. Ordenar Resultados
- ✅ Almacenamiento en caché (TTL: 5 min)
- ✅ Notas explicativas en cada paso

**Flujo principal:**
```
1. Verificar caché Redis
   ├─ Si existe → Devolver caché
   └─ Si no existe → Continuar

2. Obtener historial de usuario
   ├─ Si tiene historial → Generar con ML
   │   ├─ Construir UserVector
   │   ├─ Construir ItemVectors
   │   ├─ Calcular similaridad
   │   ├─ Predecir ratings
   │   └─ Ordenar por rating
   └─ Si no tiene historial → Fallback (items populares)

3. Almacenar en Redis (5 min)
4. Devolver recomendaciones
```

---

## 🔧 Cómo Usar Estos Diagramas

### **Opción 1: PlantUML Online**
1. Ve a [PlantUML Online Server](http://www.plantuml.com/plantuml/uml/)
2. Copia el contenido de cualquier archivo `.puml`
3. Pega en el editor
4. El diagrama se generará automáticamente
5. Descarga como PNG, SVG o PDF

### **Opción 2: VS Code con Extensión**
1. Instala la extensión "PlantUML" en VS Code
2. Abre cualquier archivo `.puml`
3. Presiona `Alt + D` para previsualizar
4. Click derecho → "Export Current Diagram" para exportar

### **Opción 3: Línea de Comandos**
```bash
# Instalar PlantUML
npm install -g node-plantuml

# Generar PNG
puml generate 01_entidad_relacion_corregido.puml -o output.png

# Generar SVG
puml generate 01_entidad_relacion_corregido.puml -o output.svg
```

---

## 📋 Resumen de Cambios por Diagrama

| Diagrama Original | Concordancia | Cambios Realizados |
|-------------------|--------------|-------------------|
| **ER (Base de Datos)** | 40% | ❌ Reestructurado completamente con tabla `items` central |
| **Componentes** | 60% | ⚠️ Agregados MLService, FavoritesService y modelos |
| **Despliegue** | 90% | ✅ Solo ajustes menores (puertos y notas) |
| **Clases** | 50% | ⚠️ Agregado sistema ML completo con clases y métodos |
| **Actividad** | 30% | ❌ Reescrito completamente con flujo ML detallado |

---

## 🎯 Diagramas que Necesitan Actualización Urgente

### 🔴 **Prioridad Alta:**
1. **Diagrama de Actividad** - El original no refleja el flujo ML real
2. **Diagrama ER** - Estructura de base de datos completamente diferente

### 🟡 **Prioridad Media:**
3. **Diagrama de Clases** - Faltaban componentes críticos (ML, Favoritos)
4. **Diagrama de Componentes** - Arquitectura incompleta

### 🟢 **Prioridad Baja:**
5. **Diagrama de Despliegue** - Solo necesitaba ajustes menores

---

## 📝 Notas Adicionales

### **Diferencias Clave con la Implementación Original:**

1. **Sistema de Favoritos:**
   - ❌ Original: Tabla simple `Favorito` con FK a `Producto`
   - ✅ Actual: Tabla `favorites` multi-tipo con `referenciaId` genérico

2. **Sistema de Recomendaciones:**
   - ❌ Original: "Filtrado colaborativo por contenido" (incorrecto)
   - ✅ Actual: Filtrado basado en contenido + Matrix Factorization simplificada

3. **Estructura de Items:**
   - ❌ Original: Tabla `Producto` única
   - ✅ Actual: Tabla `items` central + tablas específicas por categoría

4. **Caché:**
   - ❌ Original: Solo mencionado
   - ✅ Actual: Implementación completa con Redis (TTL: 5 min)

---

## 🚀 Próximos Pasos

1. **Generar imágenes** de todos los diagramas
2. **Incluir en documentación** del proyecto
3. **Actualizar** cualquier diagrama de secuencia que falte
4. **Crear** diagrama de casos de uso actualizado (si es necesario)

---

**Fecha de actualización:** 2025-11-21  
**Versión:** 1.0  
**Autor:** Sistema de Documentación CookSync
