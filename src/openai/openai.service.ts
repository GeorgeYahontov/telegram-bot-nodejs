import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {HttpService} from "@nestjs/axios";

@Injectable()
export class OpenaiService {
    constructor(private httpService: HttpService, private configService: ConfigService) {}

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
}
