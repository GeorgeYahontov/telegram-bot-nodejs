import { Injectable } from '@nestjs/common';
import { OpenaiService } from '../openai/openai.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TelegramBotService {
    constructor(
        private readonly openaiService: OpenaiService,
        private readonly httpService: HttpService,
        private readonly configService: ConfigService
    ) {}

    async processUpdate(update: any) {
        if (update.message && update.message.text) {
            const replyText = await this.openaiService.fetchOpenAIResponse(update.message.text);
            await this.sendTextMessage(update.message.chat.id, replyText);
        }
    }

    private async sendTextMessage(chatId: number, text: string) {
        const TELEGRAM_BOT_TOKEN = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
        const postData = { chat_id: chatId, text: text };
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

        await this.httpService.post(url, postData).toPromise();
    }
}
