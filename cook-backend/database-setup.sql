-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS cook CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cook;

-- Estructura de tabla para la tabla `roles`
CREATE TABLE IF NOT EXISTS `roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `codigo` varchar(20) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `permisos` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`permisos`)),
  `es_activo` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `codigo` (`codigo`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcado de datos para la tabla `roles`
INSERT IGNORE INTO `roles` (`id`, `codigo`, `nombre`, `descripcion`, `permisos`, `es_activo`, `created_at`) VALUES
(1, 'CLIENTE', 'Cliente', 'Usuario que realiza compras y contrata servicios', '["comprar", "calificar", "recetas"]', 1, '2025-07-31 01:12:16'),
(2, 'VENDEDOR', 'Vendedor/Negocio', 'Usuario que vende productos o presta servicios', '["vender", "gestionar_productos", "ver_estadisticas"]', 1, '2025-07-31 01:12:16'),
(3, 'ADMIN', 'Administrador', 'Usuario con permisos administrativos del sistema', '["admin_total"]', 1, '2025-07-31 01:12:16'),
(4, 'MODERADOR', 'Moderador', 'Usuario que modera contenido y resuelve disputas', '["moderar", "resolver_disputas"]', 1, '2025-07-31 01:12:16');

-- Estructura de tabla para la tabla `tipos_documento`
CREATE TABLE IF NOT EXISTS `tipos_documento` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `codigo` varchar(10) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `longitud_minima` int(11) NOT NULL DEFAULT 8,
  `longitud_maxima` int(11) NOT NULL DEFAULT 11,
  `patron_validacion` varchar(100) DEFAULT NULL,
  `es_activo` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `codigo` (`codigo`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcado de datos para la tabla `tipos_documento`
INSERT IGNORE INTO `tipos_documento` (`id`, `codigo`, `nombre`, `longitud_minima`, `longitud_maxima`, `patron_validacion`, `es_activo`, `created_at`) VALUES
(1, 'DNI', 'Documento Nacional de Identidad', 8, 8, '^[0-9]{8}$', 1, '2025-07-31 01:12:16'),
(2, 'CE', 'Carné de Extranjería', 9, 12, '^[0-9]{9,12}$', 1, '2025-07-31 01:12:16'),
(3, 'PASAPORTE', 'Pasaporte', 6, 12, '^[A-Z0-9]{6,12}$', 1, '2025-07-31 01:12:16'),
(4, 'RUC', 'Registro Único de Contribuyentes', 11, 11, '^[0-9]{11}$', 1, '2025-07-31 01:12:16');

-- Estructura de tabla para la tabla `planes_cliente`
CREATE TABLE IF NOT EXISTS `planes_cliente` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `codigo` varchar(20) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `precio_mensual` decimal(8,2) DEFAULT 0.00,
  `precio_anual` decimal(10,2) DEFAULT NULL,
  `incluye_recetas` tinyint(1) DEFAULT 0,
  `limite_ingredientes` int(11) DEFAULT 0,
  `limite_recetas_favoritas` int(11) DEFAULT 0,
  `funcionalidades` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`funcionalidades`)),
  `es_activo` tinyint(1) DEFAULT 1,
  `orden_mostrar` int(11) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `codigo` (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcado de datos para la tabla `planes_cliente`
INSERT IGNORE INTO `planes_cliente` (`id`, `codigo`, `nombre`, `descripcion`, `precio_mensual`, `precio_anual`, `incluye_recetas`, `limite_ingredientes`, `limite_recetas_favoritas`, `funcionalidades`, `es_activo`, `orden_mostrar`, `created_at`, `updated_at`) VALUES
(1, 'BASICO', 'Básico', 'Plan básico gratuito sin funcionalidades de recetas', 0.00, 0.00, 0, 0, 0, '["buscar_productos", "ver_tiendas"]', 1, 1, '2025-07-31 01:12:16', '2025-07-31 01:12:16'),
(2, 'LIVE', 'Live', 'Plan con acceso completo a recetas y despensa inteligente', 4.90, 49.00, 1, 50, 20, '["buscar_productos", "ver_tiendas", "recetas", "despensa", "recomendaciones"]', 1, 2, '2025-07-31 01:12:16', '2025-07-31 01:12:16'),
(3, 'PREMIUM', 'Premium', 'Plan premium con funcionalidades avanzadas y sin límites', 19.90, 199.00, 1, 100, 50, '["buscar_productos", "ver_tiendas", "recetas", "despensa", "recomendaciones", "listas_compras", "estadisticas"]', 1, 3, '2025-07-31 01:12:16', '2025-07-31 01:12:16'),
(4, 'CHEF', 'Chef', 'Plan para amantes de la cocina con acceso total', 29.90, 299.00, 1, -1, -1, '["buscar_productos", "ver_tiendas", "recetas", "despensa", "recomendaciones", "listas_compras", "estadisticas", "crear_recetas", "comunidad"]', 1, 4, '2025-07-31 01:12:16', '2025-07-31 01:12:16');

-- Estructura de tabla para la tabla `usuarios`
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `rol_id` int(11) NOT NULL,
  `tipo_documento_id` int(11) NOT NULL,
  `numero_documento` varchar(20) NOT NULL,
  `nombres` varchar(100) NOT NULL,
  `apellidos` varchar(100) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `genero` enum('M','F','O') DEFAULT 'O',
  `foto_perfil` varchar(500) DEFAULT NULL,
  `email_verificado` tinyint(1) DEFAULT 0,
  `telefono_verificado` tinyint(1) DEFAULT 0,
  `token_verificacion` varchar(100) DEFAULT NULL,
  `token_recuperacion` varchar(100) DEFAULT NULL,
  `fecha_token_expira` timestamp NULL DEFAULT NULL,
  `intentos_login` int(11) DEFAULT 0,
  `bloqueado_hasta` timestamp NULL DEFAULT NULL,
  `acepta_terminos` tinyint(1) DEFAULT 0,
  `acepta_marketing` tinyint(1) DEFAULT 0,
  `es_activo` tinyint(1) DEFAULT 1,
  `ultimo_acceso` timestamp NULL DEFAULT NULL,
  `ip_ultimo_acceso` varchar(45) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `uk_documento` (`tipo_documento_id`,`numero_documento`),
  KEY `usuarios_ibfk_1` (`rol_id`),
  KEY `usuarios_ibfk_2` (`tipo_documento_id`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`id`),
  CONSTRAINT `usuarios_ibfk_2` FOREIGN KEY (`tipo_documento_id`) REFERENCES `tipos_documento` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Estructura de tabla para la tabla `clientes`
CREATE TABLE IF NOT EXISTS `clientes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_id` int(11) NOT NULL,
  `plan_cliente_id` int(11) DEFAULT 1,
  `fecha_registro` date NOT NULL,
  `fecha_inicio_plan` date DEFAULT NULL,
  `fecha_fin_plan` date DEFAULT NULL,
  `preferencias_notificacion` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`preferencias_notificacion`)),
  `limite_credito` decimal(10,2) DEFAULT 0.00,
  `credito_usado` decimal(10,2) DEFAULT 0.00,
  `puntos_fidelidad` int(11) DEFAULT 0,
  `nivel_cliente` enum('BRONCE','PLATA','ORO','PLATINO') DEFAULT 'BRONCE',
  `descuento_personalizado` decimal(5,2) DEFAULT 0.00,
  `notas_internas` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuario_id` (`usuario_id`),
  KEY `clientes_ibfk_2` (`plan_cliente_id`),
  CONSTRAINT `clientes_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `clientes_ibfk_2` FOREIGN KEY (`plan_cliente_id`) REFERENCES `planes_cliente` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Estructura de tabla para la tabla `direcciones`
CREATE TABLE IF NOT EXISTS `direcciones` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_id` int(11) NOT NULL,
  `distrito_id` int(11) NOT NULL,
  `direccion_completa` text NOT NULL,
  `referencia` text DEFAULT NULL,
  `codigo_postal` varchar(10) DEFAULT NULL,
  `latitud` decimal(10,8) DEFAULT NULL,
  `longitud` decimal(11,8) DEFAULT NULL,
  `es_principal` tinyint(1) DEFAULT 0,
  `tipo_direccion` enum('CASA','TRABAJO','NEGOCIO','OTRO') DEFAULT 'CASA',
  `nombre_contacto` varchar(100) DEFAULT NULL,
  `telefono_contacto` varchar(20) DEFAULT NULL,
  `instrucciones_entrega` text DEFAULT NULL,
  `es_activo` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `direcciones_ibfk_1` (`usuario_id`),
  CONSTRAINT `direcciones_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
