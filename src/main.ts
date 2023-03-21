import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './modules/config/config.service';
import { ConfigType } from './types/config.type';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT: number = app.get(ConfigService).get('PORT');
  await app.listen(PORT || 3000);
}
bootstrap();
