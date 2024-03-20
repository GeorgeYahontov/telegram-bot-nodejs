import { Controller, Post, Body } from '@nestjs/common';
import { TelegramBotService } from './telegram-bot.service';

@Controller('telegram-telegram-bot')
export class TelegramBotController {
    constructor(private readonly telegramService: TelegramBotService) {}

    @Post()
    async handleMessage(@Body() body: any) {
        console.log('тело запроса', body)
        await this.telegramService.processUpdate(body);
    }
}
