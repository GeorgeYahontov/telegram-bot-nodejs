import {Injectable, Logger} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {HttpService} from "@nestjs/axios";
import OpenAI from 'openai';
import {baseKnowledge} from "./model";
export enum DialogRole {
    User = 'user',
    Assistant = 'assistant',
}
@Injectable()
export class OpenaiService {

    public dialogues: { [dialogId: string]: { role: DialogRole; content: string }[] } = {};
    private readonly logger = new Logger(OpenaiService.name);
    private openai: OpenAI;


    constructor(private httpService: HttpService,
                private configService: ConfigService) {
        const openaiApiKey = this.configService.get<string>('OPENAI_API_KEY');

        if (!openaiApiKey) {
            this.logger.error('API key for OpenAI is not provided.');
            throw new Error('API key for OpenAI is not provided.');
        }

        // Создаем конфигурацию для OpenAI с вашим API ключом
        this.openai = new OpenAI({
            apiKey: openaiApiKey, // This is the default and can be omitted
        });
    }




    async generateText(dialogues: any[]): Promise<{ promptTokens: number; replyText: string }> {
        try {
            const response = await this.openai.chat.completions.create({
                model: "gpt-3.5-turbo-0125",
                messages: dialogues,
            });

            this.logger.log('Response from OpenAI:', response);

            if (response && response.choices) {
                const replyText = response.choices[0].message.content.trim();
                return { promptTokens: response.usage.prompt_tokens, replyText };
            } else {
                throw new Error('No choices found in response.');
            }
        } catch (error) {
            this.logger.error(`Error generating text: ${error}`);
            throw error;
        }
    }

    // В OpenAiService
    async updateDialogue(dialogId: string, message: string, role: DialogRole): Promise<any> {

        if (!this.dialogues[dialogId]) {
            this.dialogues[dialogId] = [];
            const knowLage = baseKnowledge;
            const prompt = 'Ти чат бот служби банківської підтримки, твоя задача відповідати згідно з базою знань "ВІДПОВІДІ НА ЧАСТІ ЗАПИТАННЯ" , ' +
                'якщо відповідь невідома згідно з контексту бази знань ти пропонуєшь звернутися за відповідним номером телефону,' +
                ' ти не маєш відповідати на питання які не стосуються банківських послуг ТАСКОМБАНКА '
            this.dialogues[dialogId].push({ role:DialogRole.Assistant, content: `${prompt}+${knowLage}` });
            console.log('knowLage work',this.dialogues[dialogId])

        }
        this.dialogues[dialogId].push({ role, content: message });

        return this.dialogues[dialogId];
    }


/*
    async fetchOpenAIResponse(message: string): Promise<string> {
        const openaiApiKey = this.configService.get<string>('OPENAI_API_KEY');
        const data = {
            prompt: message,
            model: "gpt-3.5-turbo-0125",
            temperature: 0.7,
            max_tokens: 150,
            top_p: 1.0,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
        };

        try {
            const response = await this.httpService.post('https://api.openai.com/v1/chat/completions', data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${openaiApiKey}`,
                },
            }).toPromise();

            if (response.data.choices && response.data.choices.length > 0) {
                return response.data.choices[0].text.trim();
            } else {
                throw new Error('No choices found in response.');
            }
        } catch (error) {
            console.error('Error fetching response from OpenAI:', error);
            throw new Error('Error fetching response from OpenAI.');
        }
    }
*/
}
