-- Completar configuración de la tabla clientes

-- 1. Agregar PRIMARY KEY y AUTO_INCREMENT si no existe
ALTER TABLE `clientes` 
MODIFY COLUMN `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY;

-- 2. Agregar índices y claves foráneas
ALTER TABLE `clientes` 
ADD UNIQUE KEY `uk_cliente_usuario` (`usuario_id`);

-- 3. Agregar claves foráneas si no existen
ALTER TABLE `clientes` 
ADD CONSTRAINT `fk_clientes_usuario` 
FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

ALTER TABLE `clientes` 
ADD CONSTRAINT `fk_clientes_plan` 
FOREIGN KEY (`plan_cliente_id`) REFERENCES `planes_cliente` (`id`);

-- 4. Crear registros de clientes para usuarios existentes que no tengan cliente
INSERT IGNORE INTO `clientes` (
  `usuario_id`, 
  `plan_cliente_id`, 
  `fecha_registro`, 
  `puntos_fidelidad`, 
  `nivel_cliente`, 
  `limite_credito`, 
  `credito_usado`, 
  `descuento_personalizado`
)
SELECT 
  u.id,
  1, -- Plan básico por defecto
  CURDATE(),
  0,
  'BRONCE',
  0.00,
  0.00,
  0.00
FROM usuarios u
LEFT JOIN clientes c ON u.id = c.usuario_id
WHERE c.usuario_id IS NULL 
  AND u.rol_id = 1; -- Solo para usuarios con rol CLIENTE

-- 5. Verificar resultados
SELECT 
  'Total usuarios' as descripcion, 
  COUNT(*) as cantidad 
FROM usuarios
UNION ALL
SELECT 
  'Total clientes' as descripcion, 
  COUNT(*) as cantidad 
FROM clientes
UNION ALL
SELECT 
  'Usuarios sin cliente' as descripcion, 
  COUNT(*) as cantidad 
FROM usuarios u
LEFT JOIN clientes c ON u.id = c.usuario_id
WHERE c.usuario_id IS NULL AND u.rol_id = 1;
