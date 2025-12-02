# 📊 Diagramas UML Simplificados - CookSync

## 🎯 Filosofía de Diseño

Cada diagrama muestra **UN SOLO PROCESO** de forma clara y concisa, sin sobrecargar con información innecesaria.

---

## 📁 Estructura de Diagramas

### **1️⃣ Modelo de Datos (Entidad-Relación)**

#### **01a_er_core_items.puml** - Estructura Core
- ✅ Tabla `items` central
- ✅ Relaciones con categorías (celulares, tortas, lugares, deportes)
- ✅ Enfoque: Estructura básica de datos

#### **01b_er_favoritos.puml** - Sistema de Favoritos
- ✅ Relación Usuario → Favorite → Items
- ✅ Tipos soportados (ENUM)
- ✅ Enfoque: Cómo funcionan los favoritos

#### **01c_er_actividades.puml** - Registro de Actividades
- ✅ Relación Usuario → UserActivity → Items
- ✅ Tipos de actividad para ML
- ✅ Enfoque: Tracking de interacciones

---

### **2️⃣ Diagramas de Secuencia**

#### **02a_secuencia_cache.puml** - Verificación de Caché
- ✅ Flujo: Usuario → Frontend → API → Redis
- ✅ Decisión: Existe en caché o no
- ✅ Enfoque: Sistema de caché

#### **02b_secuencia_ml.puml** - Generación ML
- ✅ Flujo: API → MLService → MySQL
- ✅ Pasos: Construir vectores → Calcular similaridad → Predecir
- ✅ Enfoque: Algoritmo ML

#### **02c_secuencia_fallback.puml** - Fallback (Cold Start)
- ✅ Flujo: API → FallbackService → MySQL
- ✅ Criterios: Popularidad, rating, fecha
- ✅ Enfoque: Usuarios nuevos

#### **02d_secuencia_actividad.puml** - Registro de Actividad
- ✅ Flujo: Usuario → Frontend → API → MySQL → Redis
- ✅ Invalidación de caché
- ✅ Enfoque: Tracking de interacciones

---

### **3️⃣ Diagramas de Actividad**

#### **03a_actividad_cache.puml** - Verificación de Caché
- ✅ Decisión simple: ¿Existe en caché?
- ✅ Enfoque: Flujo de caché

#### **03b_actividad_ml.puml** - Algoritmo ML
- ✅ Particiones: Vectores → Similaridad → Predicción
- ✅ Notas explicativas en cada paso
- ✅ Enfoque: Proceso ML completo

#### **03c_actividad_fallback.puml** - Fallback
- ✅ Flujo lineal simple
- ✅ Criterios de ordenamiento
- ✅ Enfoque: Alternativa para usuarios nuevos

---

### **4️⃣ Diagramas de Componentes**

#### **04_componentes_recomendaciones.puml** - Sistema de Recomendaciones
- ✅ Frontend → API → MLService/FallbackService → Persistencia
- ✅ Enfoque: Arquitectura de recomendaciones

#### **05_componentes_favoritos.puml** - Sistema de Favoritos
- ✅ Frontend → API → FavoritesService → MySQL
- ✅ Enfoque: Arquitectura de favoritos

---

### **5️⃣ Diagramas de Clases**

#### **06_clases_ml.puml** - Motor ML
- ✅ MLRecommendationsService + modelos (UserVector, ItemVector, PredictionResult)
- ✅ Métodos principales
- ✅ Enfoque: Clases del sistema ML

#### **07_clases_favoritos.puml** - Sistema de Favoritos
- ✅ FavoritesService + DTOs + Enums
- ✅ Métodos CRUD
- ✅ Enfoque: Clases del sistema de favoritos

---

### **6️⃣ Diagrama de Despliegue**

#### **08_despliegue.puml** - Arquitectura General
- ✅ Cliente → Nginx → Node.js → Servicios de Datos
- ✅ Puertos especificados
- ✅ Enfoque: Infraestructura física

---

## 📊 Comparación: Complejo vs Simplificado

| Aspecto | Diagramas Complejos | Diagramas Simplificados |
|---------|---------------------|------------------------|
| **Líneas por diagrama** | 200-280 líneas | 30-80 líneas |
| **Procesos por diagrama** | 3-5 procesos | 1 proceso |
| **Tiempo de comprensión** | 5-10 minutos | 1-2 minutos |
| **Nivel de detalle** | Muy alto | Esencial |
| **Uso recomendado** | Documentación técnica | Presentaciones, explicaciones |

---

## 🎯 Cuándo Usar Cada Tipo

### **Diagramas Simplificados (esta carpeta):**
- ✅ Presentaciones a stakeholders
- ✅ Explicaciones rápidas del sistema
- ✅ Onboarding de nuevos desarrolladores
- ✅ Documentación de alto nivel

### **Diagramas Completos (carpeta padre):**
- ✅ Documentación técnica detallada
- ✅ Referencia para implementación
- ✅ Análisis de arquitectura
- ✅ Auditorías de código

---

## 🚀 Cómo Generar los Diagramas

### **Opción 1: PlantUML Online**
1. Ve a http://www.plantuml.com/plantuml/uml/
2. Copia el contenido de cualquier `.puml`
3. Pega y visualiza

### **Opción 2: VS Code**
1. Instala extensión "PlantUML"
2. Abre archivo `.puml`
3. Presiona `Alt + D`

### **Opción 3: Línea de Comandos**
```bash
# Generar todos los diagramas
cd simple
plantuml -tpng *.puml
```

---

## 📋 Índice Rápido

| # | Diagrama | Proceso | Complejidad |
|---|----------|---------|-------------|
| 01a | ER Core | Estructura de datos | ⭐⭐ |
| 01b | ER Favoritos | Sistema de favoritos | ⭐⭐ |
| 01c | ER Actividades | Tracking ML | ⭐⭐ |
| 02a | Secuencia Caché | Verificación caché | ⭐ |
| 02b | Secuencia ML | Algoritmo ML | ⭐⭐⭐ |
| 02c | Secuencia Fallback | Cold Start | ⭐⭐ |
| 02d | Secuencia Actividad | Registro | ⭐⭐ |
| 03a | Actividad Caché | Decisión caché | ⭐ |
| 03b | Actividad ML | Proceso ML | ⭐⭐⭐ |
| 03c | Actividad Fallback | Alternativa | ⭐ |
| 04 | Componentes Rec | Arquitectura ML | ⭐⭐ |
| 05 | Componentes Fav | Arquitectura Fav | ⭐⭐ |
| 06 | Clases ML | Clases ML | ⭐⭐⭐ |
| 07 | Clases Favoritos | Clases Fav | ⭐⭐ |
| 08 | Despliegue | Infraestructura | ⭐⭐ |

**Leyenda de Complejidad:**
- ⭐ = Muy simple (1-2 minutos)
- ⭐⭐ = Simple (2-3 minutos)
- ⭐⭐⭐ = Moderado (3-5 minutos)

---

## ✅ Ventajas de los Diagramas Simplificados

1. **Claridad:** Un solo concepto por diagrama
2. **Rapidez:** Comprensión inmediata
3. **Modularidad:** Combina diagramas según necesidad
4. **Mantenibilidad:** Fácil de actualizar
5. **Presentabilidad:** Ideal para slides y documentos

---

## 📖 Flujos Recomendados para Explicar el Sistema

### **Para explicar Recomendaciones ML:**
1. `02a_secuencia_cache.puml` - Verificación de caché
2. `02b_secuencia_ml.puml` - Proceso ML
3. `03b_actividad_ml.puml` - Detalle del algoritmo
4. `06_clases_ml.puml` - Clases involucradas

### **Para explicar Favoritos:**
1. `01b_er_favoritos.puml` - Modelo de datos
2. `05_componentes_favoritos.puml` - Arquitectura
3. `07_clases_favoritos.puml` - Clases

### **Para explicar Arquitectura General:**
1. `08_despliegue.puml` - Infraestructura
2. `04_componentes_recomendaciones.puml` - Componentes ML
3. `05_componentes_favoritos.puml` - Componentes Favoritos

---

**Fecha:** 2025-11-21  
**Versión:** 1.0 (Simplificada)  
**Total de diagramas:** 15
