import { AppModule } from './api.module';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableShutdownHooks();
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.enableCors({
    origin: true,
    credentials: true,
    allowedHeaders: 'authorization, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe',
    methods: 'GET,PUT,POST,DELETE,UPDATE,OPTIONS,PATCH',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      // skipNullProperties: true,
      // skipMissingProperties: true,
      // forbidNonWhitelisted: true,
    }),
  );
  setupSwagger(app);

  await app.listen(process.env.PORT || 3000);

  console.log(new Date().toString());
}

bootstrap();

function setupSwagger(app) {
  if (['1', 'true'].includes(process.env.ACTIVE_SWAGGER)) {
    const config = new DocumentBuilder()
      .setTitle('API Documentation')
      .setDescription('The API description for the project')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('base')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, document);
  }
}
