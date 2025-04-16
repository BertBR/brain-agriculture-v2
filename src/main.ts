import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');
  
  app.enableCors();
  app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('API de Gerenciamento de Produtores Rurais')
    .setDescription('API para gerenciamento de produtores rurais, fazendas e culturas')
    .setVersion('1.0')
    .addTag('produtores')
    .addTag('fazendas')
    .addTag('culturas')
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`Aplicação rodando na porta ${port}`);
}
bootstrap();