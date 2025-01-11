import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { env } from './common/utils/envConfig';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // Important for cookies/authentication
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
  });
  const config = new DocumentBuilder()
    .setTitle('Restaurant Menu Management API')
    .setDescription('API for managing restaurant menus')
    .setVersion('1.0')
    .addBearerAuth() // Add JWT authentication support in Swagger
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Swagger will be available at /api
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(env.PORT);
}
bootstrap();
