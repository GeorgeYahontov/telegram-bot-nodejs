require('dotenv').config({ path: 'environment/.env' });
console.log(process.env.OPENAI_API_KEY); // Должно выводить ваш ключ

const OpenAI = require('openai-api');
const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // Используйте переменные окружения для безопасности
const openai = new OpenAI(OPENAI_API_KEY);

async function fetchOpenAIResponse(message) {
    try {
        const response = await openai.complete({
            engine: 'text-davinci-003',
            prompt: message,
            maxTokens: 100,
            temperature: 0.5,
            topP: 1.0,
            frequencyPenalty: 0.0,
            presencePenalty: 0.0,
        });
        return response.data.choices[0].text.trim();
    } catch (error) {
        console.error("Error fetching response from OpenAI:", error);
        return "Извините, произошла ошибка при обработке вашего запроса.";
    }
}

module.exports = { fetchOpenAIResponse };
