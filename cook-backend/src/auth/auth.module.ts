import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { Client } from './entities/client.entity';
import { Role } from './entities/role.entity';
import { DocumentType } from './entities/document-type.entity';
import { ClientPlan } from './entities/client-plan.entity';
import { Address } from './entities/address.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Client,
      Role,
      DocumentType,
      ClientPlan,
      Address,
    ]),
    JwtModule.register({
      secret:
        process.env.JWT_SECRET || 'fallback-secret-key-change-in-production',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
