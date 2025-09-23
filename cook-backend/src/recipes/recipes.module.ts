import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipesController } from './recipes.controller';
import { RecipesPrismaService } from './recipes-prisma.service';
import { User } from '../auth/entities/user.entity';
import { Role } from '../auth/entities/role.entity';
import { RolesGuard } from '../auth/guards/roles.guard';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  controllers: [RecipesController],
  providers: [RecipesPrismaService, RolesGuard],
  exports: [RecipesPrismaService],
})
export class RecipesModule {}
