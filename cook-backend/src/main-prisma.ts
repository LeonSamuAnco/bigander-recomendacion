import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppPrismaModule } from './app-prisma.module';

async function bootstrap() {
  const app = await NestFactory.create(AppPrismaModule);

  // Configurar CORS
  app.enableCors({
    origin: 'http://localhost:3000', // URL del frontend
    credentials: true,
  });

  // Configurar validación global
  app.useGlobalPipes(new ValidationPipe());

  const port = process.env.PORT || 3002;
  await app.listen(port);
  console.log(`La aplicación está corriendo en: http://localhost:${port}`);
}
bootstrap();
