import {
  IsOptional,
  IsInt,
  IsString,
  IsBoolean,
  Min,
  Max,
  IsArray,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class RecipeFiltersDto {
  @IsOptional()
  @IsString({ message: 'El término de búsqueda debe ser texto' })
  @Transform(({ value }) => value?.trim())
  search?: string;

  @IsOptional()
  @IsInt({ message: 'El ID de la categoría debe ser un número entero' })
  @Min(1, { message: 'El ID de la categoría debe ser mayor a 0' })
  @Type(() => Number)
  categoriaId?: number;

  @IsOptional()
  @IsInt({ message: 'El ID de la dificultad debe ser un número entero' })
  @Min(1, { message: 'El ID de la dificultad debe ser mayor a 0' })
  @Type(() => Number)
  dificultadId?: number;

  @IsOptional()
  @IsInt({ message: 'El tiempo máximo debe ser un número entero' })
  @Min(1, { message: 'El tiempo máximo debe ser mayor a 0' })
  @Max(1440, { message: 'El tiempo máximo no puede exceder 24 horas' })
  @Type(() => Number)
  tiempoMax?: number;

  @IsOptional()
  @IsInt({ message: 'Las porciones mínimas deben ser un número entero' })
  @Min(1, { message: 'Las porciones mínimas deben ser mayor a 0' })
  @Type(() => Number)
  porcionesMin?: number;

  @IsOptional()
  @IsInt({ message: 'Las porciones máximas deben ser un número entero' })
  @Min(1, { message: 'Las porciones máximas deben ser mayor a 0' })
  @Type(() => Number)
  porcionesMax?: number;

  @IsOptional()
  @IsBoolean({ message: 'El filtro vegetariana debe ser verdadero o falso' })
  @Transform(({ value }) => value === 'true' || value === true)
  esVegetariana?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'El filtro vegana debe ser verdadero o falso' })
  @Transform(({ value }) => value === 'true' || value === true)
  esVegana?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'El filtro sin gluten debe ser verdadero o falso' })
  @Transform(({ value }) => value === 'true' || value === true)
  sinGluten?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'El filtro sin lactosa debe ser verdadero o falso' })
  @Transform(({ value }) => value === 'true' || value === true)
  sinLactosa?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'El filtro saludable debe ser verdadero o falso' })
  @Transform(({ value }) => value === 'true' || value === true)
  esSaludable?: boolean;

  @IsOptional()
  @IsString({ message: 'El país de origen debe ser texto' })
  origenPais?: string;

  @IsOptional()
  @IsArray({ message: 'Los ingredientes deben ser un array' })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
    }
    return value;
  })
  ingredientes?: number[];

  @IsOptional()
  @IsInt({ message: 'La página debe ser un número entero' })
  @Min(1, { message: 'La página debe ser mayor a 0' })
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsInt({ message: 'El límite debe ser un número entero' })
  @Min(1, { message: 'El límite debe ser mayor a 0' })
  @Max(100, { message: 'El límite no puede exceder 100' })
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @IsString({ message: 'El campo de ordenamiento debe ser texto' })
  sortBy?: 'nombre' | 'createdAt' | 'tiempoTotal' | 'calificacionPromedio' | 'popularidad';

  @IsOptional()
  @IsString({ message: 'La dirección de ordenamiento debe ser texto' })
  sortOrder?: 'asc' | 'desc';
}
