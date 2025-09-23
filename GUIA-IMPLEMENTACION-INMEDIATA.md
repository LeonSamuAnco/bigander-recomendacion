# 🚀 **GUÍA DE IMPLEMENTACIÓN INMEDIATA - COOKSYNC**

## 📋 **ESTADO ACTUAL**
✅ **Completado:**
- Seguridad básica configurada
- Middleware de seguridad implementado
- Validaciones mejoradas
- JWT con variables de entorno
- Rate limiting básico

🔄 **En Progreso:**
- Migración a Prisma

## 🎯 **PRÓXIMOS PASOS CRÍTICOS**

### **PASO 1: COMPLETAR MIGRACIÓN A PRISMA (HOY)**

#### **1.1 Configurar Prisma Service**
```bash
# Crear servicio de Prisma
mkdir src/prisma
```

Crear archivo: `src/prisma/prisma.service.ts`
```typescript
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

#### **1.2 Crear Prisma Module**
Crear archivo: `src/prisma/prisma.module.ts`
```typescript
import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

#### **1.3 Actualizar App Module**
```typescript
// En src/app.module.ts - AGREGAR:
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    // ... otros imports
    PrismaModule, // ← AGREGAR ESTA LÍNEA
  ],
  // ...
})
```

#### **1.4 Migrar AuthService a Prisma**
```typescript
// En src/auth/auth.service.ts - REEMPLAZAR imports:
import { PrismaService } from '../prisma/prisma.service';

// En constructor - REEMPLAZAR:
constructor(
  private prisma: PrismaService,
  private jwtService: JwtService,
) {}

// Ejemplo de método migrado:
async getUserById(id: number) {
  const user = await this.prisma.user.findUnique({
    where: { id },
    include: {
      rol: true,
      tipoDocumento: true,
      cliente: true,
    },
  });
  
  if (!user) {
    throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
  }
  
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}
```

### **PASO 2: IMPLEMENTAR CRUD DE RECETAS (ESTA SEMANA)**

#### **2.1 Crear Recipe Service con Prisma**
```typescript
// src/recipes/recipes.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RecipesService {
  constructor(private prisma: PrismaService) {}

  async create(createRecipeDto: CreateRecipeDto) {
    return this.prisma.recipe.create({
      data: {
        ...createRecipeDto,
        ingredientes: {
          create: createRecipeDto.ingredientes.map(ing => ({
            ingredienteMaestroId: ing.ingredienteMaestroId,
            cantidad: ing.cantidad,
            unidadMedidaId: ing.unidadMedidaId,
          })),
        },
      },
      include: {
        categoria: true,
        dificultad: true,
        ingredientes: {
          include: {
            ingredienteMaestro: true,
            unidadMedida: true,
          },
        },
      },
    });
  }

  async findAll(filters?: RecipeFilters) {
    return this.prisma.recipe.findMany({
      where: {
        esActivo: true,
        ...(filters?.categoriaId && { categoriaRecetaId: filters.categoriaId }),
        ...(filters?.dificultadId && { dificultadId: filters.dificultadId }),
        ...(filters?.tiempoMax && { tiempoTotal: { lte: filters.tiempoMax } }),
      },
      include: {
        categoria: true,
        dificultad: true,
        ingredientes: {
          include: {
            ingredienteMaestro: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByIngredients(ingredientIds: number[]) {
    return this.prisma.recipe.findMany({
      where: {
        esActivo: true,
        ingredientes: {
          some: {
            ingredienteMaestroId: {
              in: ingredientIds,
            },
          },
        },
      },
      include: {
        categoria: true,
        dificultad: true,
        ingredientes: {
          include: {
            ingredienteMaestro: true,
          },
        },
      },
    });
  }
}
```

#### **2.2 Crear DTOs para Recetas**
```typescript
// src/recipes/dto/create-recipe.dto.ts
import { IsString, IsInt, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CreateRecipeIngredientDto {
  @IsInt()
  ingredienteMaestroId: number;

  @IsInt()
  cantidad: number;

  @IsInt()
  unidadMedidaId: number;
}

export class CreateRecipeDto {
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsInt()
  categoriaRecetaId: number;

  @IsInt()
  dificultadId: number;

  @IsInt()
  tiempoPreparacion: number;

  @IsString()
  instrucciones: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRecipeIngredientDto)
  ingredientes: CreateRecipeIngredientDto[];
}
```

#### **2.3 Actualizar Recipe Controller**
```typescript
// src/recipes/recipes.controller.ts
import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createRecipeDto: CreateRecipeDto) {
    return this.recipesService.create(createRecipeDto);
  }

  @Get()
  findAll(@Query() filters: RecipeFilters) {
    return this.recipesService.findAll(filters);
  }

  @Get('by-ingredients')
  findByIngredients(@Query('ingredients') ingredients: string) {
    const ingredientIds = ingredients.split(',').map(id => parseInt(id));
    return this.recipesService.findByIngredients(ingredientIds);
  }
}
```

### **PASO 3: MEJORAR FRONTEND (ESTA SEMANA)**

#### **3.1 Crear Context para Recetas**
```javascript
// src/context/RecipeContext.js
import React, { createContext, useContext, useState } from 'react';

const RecipeContext = createContext();

export const useRecipes = () => {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error('useRecipes debe usarse dentro de RecipeProvider');
  }
  return context;
};

export const RecipeProvider = ({ children }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({});

  const fetchRecipes = async (newFilters = {}) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams(newFilters).toString();
      const response = await fetch(`http://localhost:3002/recipes?${queryParams}`);
      const data = await response.json();
      setRecipes(data);
      setFilters(newFilters);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchByIngredients = async (ingredientIds) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3002/recipes/by-ingredients?ingredients=${ingredientIds.join(',')}`
      );
      const data = await response.json();
      setRecipes(data);
    } catch (error) {
      console.error('Error searching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <RecipeContext.Provider value={{
      recipes,
      loading,
      filters,
      fetchRecipes,
      searchByIngredients,
    }}>
      {children}
    </RecipeContext.Provider>
  );
};
```

#### **3.2 Crear Componente de Búsqueda**
```javascript
// src/components/recipes/RecipeSearch.js
import React, { useState } from 'react';
import { useRecipes } from '../../context/RecipeContext';

const RecipeSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const { searchByIngredients, fetchRecipes } = useRecipes();

  const handleSearch = () => {
    if (selectedIngredients.length > 0) {
      searchByIngredients(selectedIngredients);
    } else {
      fetchRecipes({ search: searchTerm });
    }
  };

  return (
    <div className="recipe-search">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar recetas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>🔍 Buscar</button>
      </div>
      
      <div className="ingredient-selector">
        <h3>Buscar por ingredientes disponibles:</h3>
        {/* Aquí irá el selector de ingredientes */}
      </div>
    </div>
  );
};

export default RecipeSearch;
```

### **PASO 4: CONFIGURAR VARIABLES DE ENTORNO**

#### **4.1 Actualizar .env.example**
```env
# Base de datos
DATABASE_URL="mysql://root:admin@localhost:3306/cook"
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=admin
DB_DATABASE=cook

# JWT
JWT_SECRET=tu-clave-secreta-muy-larga-y-segura-aqui

# Aplicación
NODE_ENV=development
PORT=3002
FRONTEND_URL=http://localhost:3000

# Archivos
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

#### **4.2 Crear tu archivo .env**
```bash
# Copia .env.example a .env y actualiza los valores
cp .env.example .env
```

### **PASO 5: TESTING BÁSICO**

#### **5.1 Test de AuthService**
```typescript
// src/auth/auth.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find user by id', async () => {
    const mockUser = { id: 1, email: 'test@test.com' };
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser);

    const result = await service.getUserById(1);
    expect(result).toEqual(mockUser);
  });
});
```

## 🎯 **CRONOGRAMA ESTA SEMANA**

### **HOY (Miércoles):**
- ✅ Completar migración a Prisma
- ✅ Configurar variables de entorno
- ✅ Probar autenticación con Prisma

### **Jueves:**
- 🔄 Implementar CRUD básico de recetas
- 🔄 Crear DTOs y validaciones
- 🔄 Probar endpoints de recetas

### **Viernes:**
- 🔄 Implementar búsqueda por ingredientes
- 🔄 Mejorar frontend con context
- 🔄 Testing básico

### **Fin de Semana:**
- 🔄 Optimizar performance
- 🔄 Documentar API
- 🔄 Preparar siguiente fase

## 🚨 **COMANDOS IMPORTANTES**

### **Prisma:**
```bash
# Generar cliente Prisma
npx prisma generate

# Ver base de datos
npx prisma studio

# Aplicar cambios al schema
npx prisma db push
```

### **Testing:**
```bash
# Ejecutar tests
npm run test

# Tests en modo watch
npm run test:watch

# Coverage
npm run test:cov
```

### **Desarrollo:**
```bash
# Backend en modo desarrollo
npm run start:dev

# Frontend
cd cook-frontend && npm start
```

## 🎉 **RESULTADO ESPERADO AL FINAL DE LA SEMANA**

- ✅ **Sistema completamente migrado a Prisma**
- ✅ **CRUD de recetas funcional**
- ✅ **Búsqueda por ingredientes operativa**
- ✅ **Frontend mejorado con context**
- ✅ **Tests básicos implementados**
- ✅ **Sistema seguro y optimizado**

## 🚀 **¡EMPEZAR AHORA!**

**Primer comando a ejecutar:**
```bash
cd cook-backend
mkdir src/prisma
# Crear los archivos de Prisma según la guía
```

¡Con esta guía tendrás un sistema funcional y seguro en una semana! 🍳✨
