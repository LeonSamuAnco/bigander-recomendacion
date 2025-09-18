-- Verificar y corregir las tablas existentes
USE cook;

-- Verificar estructura de la tabla usuarios
DESCRIBE usuarios;

-- Si la tabla existe pero no tiene AUTO_INCREMENT, la corregimos
ALTER TABLE usuarios MODIFY COLUMN id int(11) NOT NULL AUTO_INCREMENT;

-- Verificar estructura de la tabla clientes
DESCRIBE clientes;

-- Si la tabla existe pero no tiene AUTO_INCREMENT, la corregimos
ALTER TABLE clientes MODIFY COLUMN id int(11) NOT NULL AUTO_INCREMENT;

-- Mostrar las tablas existentes
SHOW TABLES;
