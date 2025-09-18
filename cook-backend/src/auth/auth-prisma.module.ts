import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthPrismaController } from './auth-prisma.controller';
import { AuthPrismaService } from './auth-prisma.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthPrismaController],
  providers: [AuthPrismaService],
  exports: [AuthPrismaService],
})
export class AuthPrismaModule {}
