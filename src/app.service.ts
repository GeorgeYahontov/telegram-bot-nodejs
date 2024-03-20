import {Injectable, Logger} from '@nestjs/common';
import {ConfigService} from "@nestjs/config";

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(private configService: ConfigService) {}

  logEnvironmentVariables(): void {
    // Логирование переменных окружения
    this.logger.log(`OPENAI_API_KEY: ${this.configService.get('OPENAI_API_KEY')}`);
    this.logger.log(`TELEGRAM_BOT_TOKEN: ${this.configService.get('TELEGRAM_BOT_TOKEN')}`);
  }
  getHello(): string {
    return 'Hello World!';
  }
}
