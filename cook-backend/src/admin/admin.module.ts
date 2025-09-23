import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User } from '../auth/entities/user.entity';
import { Role } from '../auth/entities/role.entity';
import { RolesGuard } from '../auth/guards/roles.guard';
import { RecipesPrismaService } from '../recipes/recipes-prisma.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  controllers: [AdminController],
  providers: [AdminService, RolesGuard, RecipesPrismaService],
  exports: [AdminService],
})
export class AdminModule {}
