import {
  IsString,
  IsInt,
  IsOptional,
  IsArray,
  ValidateNested,
  IsBoolean,
  IsDecimal,
  Min,
  Max,
  IsNotEmpty,
  MaxLength,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreateRecipeIngredientDto {
  @IsInt({ message: 'El ID del ingrediente debe ser un número entero' })
  @Min(1, { message: 'El ID del ingrediente debe ser mayor a 0' })
  ingredienteMaestroId: number;

  @IsDecimal(
    { decimal_digits: '0,2' },
    { message: 'La cantidad debe ser un número decimal válido' },
  )
  @Transform(({ value }) => parseFloat(value))
  cantidad: number;

  @IsInt({ message: 'El ID de la unidad de medida debe ser un número entero' })
  @Min(1, { message: 'El ID de la unidad de medida debe ser mayor a 0' })
  unidadMedidaId: number;

  @IsOptional()
  @IsBoolean({ message: 'El campo opcional debe ser verdadero o falso' })
  esOpcional?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'El campo principal debe ser verdadero o falso' })
  esPrincipal?: boolean;

  @IsOptional()
  @IsString({ message: 'Las notas deben ser texto' })
  @MaxLength(200, { message: 'Las notas no pueden exceder 200 caracteres' })
  notas?: string;

  @IsOptional()
  @IsInt({ message: 'El orden de aparición debe ser un número entero' })
  @Min(1, { message: 'El orden de aparición debe ser mayor a 0' })
  ordenAparicion?: number;
}

export class CreateRecipeDto {
  @IsString({ message: 'El nombre debe ser texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MaxLength(200, { message: 'El nombre no puede exceder 200 caracteres' })
  @Transform(({ value }) => value?.trim())
  nombre: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser texto' })
  @MaxLength(1000, { message: 'La descripción no puede exceder 1000 caracteres' })
  descripcion?: string;

  @IsInt({ message: 'El ID de la categoría debe ser un número entero' })
  @Min(1, { message: 'El ID de la categoría debe ser mayor a 0' })
  categoriaRecetaId: number;

  @IsInt({ message: 'El ID de la dificultad debe ser un número entero' })
  @Min(1, { message: 'El ID de la dificultad debe ser mayor a 0' })
  dificultadId: number;

  @IsInt({ message: 'El tiempo de preparación debe ser un número entero' })
  @Min(1, { message: 'El tiempo de preparación debe ser mayor a 0' })
  @Max(1440, { message: 'El tiempo de preparación no puede exceder 24 horas' })
  tiempoPreparacion: number;

  @IsOptional()
  @IsInt({ message: 'El tiempo de cocción debe ser un número entero' })
  @Min(0, { message: 'El tiempo de cocción no puede ser negativo' })
  @Max(1440, { message: 'El tiempo de cocción no puede exceder 24 horas' })
  tiempoCoccion?: number;

  @IsInt({ message: 'Las porciones deben ser un número entero' })
  @Min(1, { message: 'Debe ser al menos 1 porción' })
  @Max(50, { message: 'No puede exceder 50 porciones' })
  porciones: number;

  @IsString({ message: 'Las instrucciones deben ser texto' })
  @IsNotEmpty({ message: 'Las instrucciones son obligatorias' })
  @MaxLength(10000, { message: 'Las instrucciones no pueden exceder 10000 caracteres' })
  instrucciones: string;

  @IsOptional()
  @IsString({ message: 'La URL de la imagen debe ser texto' })
  @MaxLength(500, { message: 'La URL de la imagen no puede exceder 500 caracteres' })
  imagenPrincipal?: string;

  @IsOptional()
  @IsString({ message: 'Los tips de cocina deben ser texto' })
  @MaxLength(1000, { message: 'Los tips no pueden exceder 1000 caracteres' })
  tipsCocina?: string;

  @IsOptional()
  @IsString({ message: 'El país de origen debe ser texto' })
  @MaxLength(50, { message: 'El país de origen no puede exceder 50 caracteres' })
  origenPais?: string;

  @IsOptional()
  @IsBoolean({ message: 'El campo vegetariana debe ser verdadero o falso' })
  esVegetariana?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'El campo vegana debe ser verdadero o falso' })
  esVegana?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'El campo sin gluten debe ser verdadero o falso' })
  sinGluten?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'El campo sin lactosa debe ser verdadero o falso' })
  sinLactosa?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'El campo saludable debe ser verdadero o falso' })
  esSaludable?: boolean;

  @IsArray({ message: 'Los ingredientes deben ser un array' })
  @ValidateNested({ each: true })
  @Type(() => CreateRecipeIngredientDto)
  ingredientes: CreateRecipeIngredientDto[];

  // Campo calculado automáticamente
  @IsOptional()
  autorId?: number;
}
