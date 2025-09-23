import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsInt,
  IsBoolean,
  IsDateString,
  IsIn,
  Matches,
  IsPhoneNumber,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @IsEmail({}, { message: 'El email debe tener un formato válido' })
  @IsNotEmpty({ message: 'El email es obligatorio' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

  @IsString({ message: 'La contraseña debe ser texto' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @MaxLength(50, { message: 'La contraseña no puede exceder 50 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
  })
  password: string;

  @IsString({ message: 'Los nombres deben ser texto' })
  @IsNotEmpty({ message: 'Los nombres son obligatorios' })
  @MinLength(2, { message: 'Los nombres deben tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'Los nombres no pueden exceder 100 caracteres' })
  @Transform(({ value }) => value?.trim())
  nombres: string;

  @IsString({ message: 'Los apellidos deben ser texto' })
  @IsNotEmpty({ message: 'Los apellidos son obligatorios' })
  @MinLength(2, { message: 'Los apellidos deben tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'Los apellidos no pueden exceder 100 caracteres' })
  @Transform(({ value }) => value?.trim())
  apellidos: string;

  @IsInt({ message: 'El tipo de documento debe ser un número entero' })
  @IsNotEmpty({ message: 'El tipo de documento es obligatorio' })
  tipoDocumentoId: number;

  @IsString({ message: 'El número de documento debe ser texto' })
  @IsNotEmpty({ message: 'El número de documento es obligatorio' })
  @MinLength(8, { message: 'El número de documento debe tener al menos 8 caracteres' })
  @MaxLength(20, { message: 'El número de documento no puede exceder 20 caracteres' })
  @Matches(/^[0-9A-Za-z]+$/, {
    message: 'El número de documento solo puede contener letras y números'
  })
  numeroDocumento: string;

  @IsOptional()
  @IsPhoneNumber('PE', { message: 'El teléfono debe tener un formato válido para Perú' })
  telefono?: string;

  @IsOptional()
  @IsDateString({}, { message: 'La fecha de nacimiento debe tener formato válido (YYYY-MM-DD)' })
  fechaNacimiento?: string;

  @IsOptional()
  @IsIn(['M', 'F', 'O'], { message: 'El género debe ser M, F u O' })
  genero?: string;

  @IsOptional()
  @IsInt({ message: 'El rol debe ser un número entero' })
  rolId?: number;

  @IsBoolean({ message: 'La aceptación de términos debe ser verdadero o falso' })
  aceptaTerminos: boolean;

  @IsOptional()
  @IsBoolean({ message: 'La aceptación de marketing debe ser verdadero o falso' })
  aceptaMarketing?: boolean;
}
