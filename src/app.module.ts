import * as Joi from 'joi';
import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TelegramBotModule } from "./telegram-bot/telegram-bot.module";
import { OpenaiModule } from "./openai/openai.module";
import { AppController } from './app.controller'; // Убедитесь, что путь верный
import { AppService } from './app.service';
import {LoggingMiddleware} from "./common/logging/logging.middleware"; // Убедитесь, что путь верный

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        OPENAI_API_KEY: Joi.string().required(),
        TELEGRAM_BOT_TOKEN: Joi.string().required(),
      }),
    }),
    OpenaiModule,
    TelegramBotModule,
  ],
  controllers: [AppController], // TelegramBotController теперь в TelegramBotModule
  providers: [AppService], // OpenaiService теперь в OpenaiModule
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
        .apply(LoggingMiddleware)
        .forRoutes('*'); // Применяется ко всем маршрутам
  }
}
