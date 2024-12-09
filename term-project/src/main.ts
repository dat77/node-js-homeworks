import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swaggerConfig = new DocumentBuilder()
      .setTitle('Node.js Term project')
      .setDescription('This is Rest API server on NestJS framework')
      .setVersion('1.0')
      .addTag('NodeNestTermProject')
      .build();
  const swaggerDocumentFactory = () => SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger', app, swaggerDocumentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
