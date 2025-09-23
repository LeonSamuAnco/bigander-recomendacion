-- Script para crear la tabla de recetas favoritas
-- Ejecutar en MySQL Workbench o línea de comandos

USE cook;

-- Crear tabla usuario_recetas_favoritas
CREATE TABLE IF NOT EXISTS `usuario_recetas_favoritas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `receta_id` int NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_usuario_receta` (`usuario_id`,`receta_id`),
  KEY `idx_usuario` (`usuario_id`),
  KEY `idx_receta` (`receta_id`),
  KEY `idx_fecha` (`created_at`),
  CONSTRAINT `usuario_recetas_favoritas_receta_id_fkey` FOREIGN KEY (`receta_id`) REFERENCES `recetas` (`id`) ON DELETE CASCADE,
  CONSTRAINT `usuario_recetas_favoritas_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Verificar que la tabla se creó correctamente
DESCRIBE usuario_recetas_favoritas;

-- Mostrar todas las tablas para confirmar
SHOW TABLES;
