import {
  IsEmail,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsDateString,
  IsNumber,
  IsArray,
  IsInt,
} from 'class-validator';

export class RegisterUserDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsNumber()
  @IsNotEmpty()
  rolId: number;

  @IsNumber()
  @IsNotEmpty()
  tipoDocumentoId: number;

  @IsString()
  @IsNotEmpty()
  numeroDocumento: string;

  @IsString()
  @IsNotEmpty()
  nombres: string;

  @IsString()
  @IsNotEmpty()
  apellidos: string;

  @IsString()
  @IsOptional()
  telefono?: string;

  @IsDateString()
  @IsOptional()
  fechaNacimiento?: string;

  @IsEnum(['M', 'F', 'O'])
  @IsOptional()
  genero?: 'M' | 'F' | 'O';

  @IsBoolean()
  @IsNotEmpty()
  aceptaTerminos: boolean;

  @IsBoolean()
  @IsOptional()
  aceptaMarketing?: boolean;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  categorias?: number[];

  @IsOptional()
  @IsString()
  nombreTienda?: string;

  @IsOptional()
  @IsString()
  horarioAtencion?: string;

  @IsOptional()
  @IsString()
  metodosPago?: string;

  @IsOptional()
  @IsString()
  tipoServicio?: string;

  @IsOptional()
  @IsString()
  whatsapp?: string;

  @IsOptional()
  @IsString()
  instagram?: string;

  @IsOptional()
  @IsString()
  facebook?: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;

  @IsOptional()
  @IsString()
  sitioWeb?: string;

  @IsOptional()
  @IsString()
  direccionNegocio?: string;
}
