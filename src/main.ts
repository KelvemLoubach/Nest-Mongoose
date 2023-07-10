import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {SwaggerModule, DocumentBuilder } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
  .setTitle('Cadastro de usuários')
  .setDescription('CRUD de usuários com Nest.js e MongoDB')
  .setVersion('1.0')
  .addTag('CRUD Nest.js MongoDB')
  .addBearerAuth()
  .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)
  await app.listen(3000);
}
bootstrap();
