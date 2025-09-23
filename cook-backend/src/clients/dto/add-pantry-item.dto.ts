import { IsNotEmpty, IsNumber, IsOptional, IsDateString, IsString } from 'class-validator';

export class AddPantryItemDto {
  @IsNotEmpty()
  @IsNumber()
  ingredienteMaestroId: number;

  @IsNotEmpty()
  @IsNumber()
  cantidad: number;

  @IsNotEmpty()
  @IsNumber()
  unidadMedidaId: number;

  @IsOptional()
  @IsDateString()
  fechaVencimiento?: string;

  @IsOptional()
  @IsDateString()
  fechaCompra?: string;

  @IsOptional()
  @IsString()
  notas?: string;
}
