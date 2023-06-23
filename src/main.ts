import { DatabaseEnv } from './types/database.type';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './modules/base/config/config.service';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  const PORT = config.get('PORT');
  const environment = config.get('environment');

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.useGlobalPipes(
    new ValidationPipe({
      enableDebugMessages: environment === DatabaseEnv.DEVELOPMENT,
    }),
  );

  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  await app.listen(PORT);
}
bootstrap();
