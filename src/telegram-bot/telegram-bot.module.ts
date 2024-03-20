import { Module } from '@nestjs/common';
import { TelegramBotService } from './telegram-bot.service';
import { TelegramBotController } from './telegram-bot.controller';
import { HttpModule } from '@nestjs/axios'; // Если используется HttpService
import { OpenaiModule } from '../openai/openai.module'; // Если используется OpenaiService

@Module({
    imports: [HttpModule, OpenaiModule],
    controllers: [TelegramBotController],
    providers: [TelegramBotService],
    exports: [TelegramBotService],
})
export class TelegramBotModule {}