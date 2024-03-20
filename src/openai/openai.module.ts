import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { OpenaiService } from './openai.service';

@Module({
    imports: [HttpModule, ConfigModule],
    providers: [OpenaiService],
    exports: [OpenaiService], // Экспортируйте OpenaiService, если он используется в других модулях
})
export class OpenaiModule {}
