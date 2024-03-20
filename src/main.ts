import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {AppService} from "./app.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Получение экземпляра AppService
  const appService = app.get(AppService);

  // Вызов метода логирования переменных окружения
  appService.logEnvironmentVariables();
  await app.listen(3000);
}
bootstrap();
