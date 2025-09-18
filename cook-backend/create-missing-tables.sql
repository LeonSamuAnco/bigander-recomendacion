-- Script para crear las tablas faltantes en CookSync

-- Crear tabla clientes si no existe
CREATE TABLE IF NOT EXISTS `clientes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_id` int(11) NOT NULL,
  `plan_cliente_id` int(11) DEFAULT 1,
  `fecha_registro` date NOT NULL,
  `fecha_inicio_plan` date DEFAULT NULL,
  `fecha_fin_plan` date DEFAULT NULL,
  `preferencias_notificacion` longtext DEFAULT NULL,
  `limite_credito` decimal(10,2) DEFAULT 0.00,
  `credito_usado` decimal(10,2) DEFAULT 0.00,
  `puntos_fidelidad` int(11) DEFAULT 0,
  `nivel_cliente` enum('BRONCE','PLATA','ORO','PLATINO') DEFAULT 'BRONCE',
  `descuento_personalizado` decimal(5,2) DEFAULT 0.00,
  `notas_internas` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuario_id` (`usuario_id`),
  KEY `fk_clientes_usuario` (`usuario_id`),
  KEY `fk_clientes_plan` (`plan_cliente_id`),
  CONSTRAINT `fk_clientes_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_clientes_plan` FOREIGN KEY (`plan_cliente_id`) REFERENCES `planes_cliente` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Verificar si existen usuarios sin cliente y crearlos
INSERT INTO `clientes` (
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

-- Mostrar estadísticas
SELECT 
  'Usuarios totales' as tabla, 
  COUNT(*) as cantidad 
FROM usuarios
UNION ALL
SELECT 
  'Clientes creados' as tabla, 
  COUNT(*) as cantidad 
FROM clientes
UNION ALL
SELECT 
  'Roles disponibles' as tabla, 
  COUNT(*) as cantidad 
FROM roles
UNION ALL
SELECT 
  'Tipos documento' as tabla, 
  COUNT(*) as cantidad 
FROM tipos_documento
UNION ALL
SELECT 
  'Planes cliente' as tabla, 
  COUNT(*) as cantidad 
FROM planes_cliente;
