require('dotenv').config({ path: 'environment/.env' });

const OpenAI = require('openai-api');
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
console.log(process.env.OPENAI_API_KEY); // Должно выводить ваш ключ
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
        // Логируем более подробно
        console.error("Error fetching response from OpenAI:", error);

        // Логируем HTTP-статус и текст ошибки, если это ошибка HTTP
        if (error.response) {
            console.error(`HTTP Error: ${error.response.status}`);
            console.error(`Error Body: ${error.response.data}`);
        }

        // Возвращаем пользователю более информативное сообщение
        return "Извините, произошла ошибка при обработке вашего запроса. Пожалуйста, попробуйте позже.";
    }
}


module.exports = { fetchOpenAIResponse };
