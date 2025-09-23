import { IsOptional, IsString, IsDateString, IsUrl } from 'class-validator';

export class UpdateClientDto {
  @IsOptional()
  @IsString()
  nombres?: string;

  @IsOptional()
  @IsString()
  apellidos?: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsDateString()
  fechaNacimiento?: string;

  @IsOptional()
  @IsUrl()
  fotoPerfil?: string;
}
