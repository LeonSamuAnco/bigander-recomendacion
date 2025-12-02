# Plantilla de Importación de Productos - CookSync

## Formato del Archivo Excel

Para importar productos masivamente, crea un archivo Excel (.xlsx, .xls) o CSV con las siguientes columnas:

### Columnas Requeridas:

| Columna | Descripción | Ejemplo | Obligatorio |
|---------|-------------|---------|-------------|
| **Nombre** | Nombre del producto | "Aceite de Oliva Extra Virgen" | ✅ Sí |
| **Precio** | Precio en soles (número decimal) | 25.50 | ✅ Sí |
| **Stock** | Cantidad disponible (número entero) | 100 | ❌ No (default: 0) |
| **Descripcion** | Descripción del producto | "Aceite de oliva de primera presión en frío" | ❌ No |
| **CategoriaId** | ID de la categoría (número) | 1 | ❌ No (default: 1) |
| **SKU** | Código único del producto | "AOL-001" | ❌ No |
| **Imagen** | URL de la imagen del producto | "https://ejemplo.com/aceite.jpg" | ❌ No |

### Nombres de Columnas Alternativos (Flexibles):

El sistema acepta diferentes variaciones de nombres de columnas:
- **Nombre**: `Nombre`, `nombre`, `Name`
- **Precio**: `Precio`, `precio`, `Price`
- **Stock**: `Stock`, `stock`
- **Descripción**: `Descripcion`, `descripcion`
- **CategoriaId**: `CategoriaId`, `categoriaId`
- **SKU**: `SKU`, `sku`
- **Imagen**: `Imagen`, `imagen`, `Image`

## Ejemplo de Archivo Excel:

```
| Nombre                        | Precio | Stock | Descripcion                           | CategoriaId | SKU      | Imagen |
|-------------------------------|--------|-------|---------------------------------------|-------------|----------|--------|
| Aceite de Oliva Extra Virgen  | 25.50  | 100   | Aceite de primera presión en frío     | 1           | AOL-001  |        |
| Sal Marina Fina               | 3.50   | 200   | Sal marina sin refinar                | 1           | SAL-001  |        |
| Pimienta Negra Molida         | 8.90   | 150   | Pimienta negra recién molida          | 1           | PIM-001  |        |
| Azúcar Blanca                 | 4.20   | 300   | Azúcar refinada de caña               | 1           | AZU-001  |        |
```

## Instrucciones de Uso:

1. **Descarga esta plantilla** o crea tu propio archivo Excel
2. **Llena los datos** de tus productos siguiendo el formato
3. **Guarda el archivo** como .xlsx, .xls o .csv
4. **Ve a tu Panel de Vendedor** → Productos
5. **Haz clic en "📊 Importar Excel"**
6. **Selecciona tu archivo** y espera la confirmación

## Notas Importantes:

⚠️ **Validaciones:**
- Los productos sin nombre o precio serán ignorados
- Los precios deben ser números válidos (usar punto decimal, no coma)
- El stock debe ser un número entero positivo
- Si hay errores, recibirás un resumen al final de la importación

✅ **Recomendaciones:**
- Revisa que todos los precios estén correctos antes de importar
- Usa SKUs únicos para cada producto
- Si no tienes imágenes, déjalas vacías (puedes subirlas después individualmente)
- Comienza con pocos productos para probar el formato

## Categorías Disponibles:

| ID | Nombre |
|----|--------|
| 1  | General / Ingredientes |
| 2  | Lácteos |
| 3  | Carnes |
| 4  | Verduras |
| 5  | Frutas |
| 6  | Granos y Cereales |
| 7  | Condimentos y Especias |
| 8  | Bebidas |
| 9  | Panadería |
| 10 | Otros |

*Nota: Consulta con el administrador si necesitas categorías adicionales*

## Soporte:

Si tienes problemas con la importación:
1. Verifica que el formato del archivo sea correcto
2. Asegúrate de que los nombres de las columnas coincidan
3. Revisa que los datos sean del tipo correcto (números para precio y stock)
4. Contacta al soporte técnico si el problema persiste
