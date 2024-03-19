require('dotenv').config({ path: 'environment/.env' });

const OpenAI = require('openai-api');
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
console.log(process.env.OPENAI_API_KEY); // Должно выводить ваш ключ
/*
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

*/
const https = require('https'); // Убедитесь, что https подключен в начале файла

async function fetchOpenAIResponse(message) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            prompt: message,
            model: "gpt-3.5-turbo-instruct",
            temperature: 0.7,
            max_tokens: 150,
            top_p: 1.0,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
        });

        const options = {
            hostname: 'api.openai.com',
            port: 443,
            path: '/v1/completions', // Обновлённый путь к API
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, // Исправлено для использования переменной окружения
                'Content-Length': Buffer.byteLength(data),
            },
        };

        const req = https.request(options, (res) => {
            let responseString = '';

            res.on('data', (chunk) => {
                responseString += chunk;
            });

            res.on('end', () => {
                console.log('Response from OpenAI:', responseString); // Выводим ответ в консоль
                try {
                    const response = JSON.parse(responseString);
                    if (response.choices && response.choices.length > 0) {
                        const replyText = response.choices[0].text.trim();
                        resolve(replyText);
                    } else {
                        reject(new Error('No choices found in response.'));
                    }
                } catch (error) {
                    reject(new Error(`Error parsing response: ${error}`)); // Исправлена строка для корректного отображения ошибки
                }
            });
        });

        req.on('error', (error) => {
            reject(new Error(`Request failed: ${error.message}`)); // Исправлена строка для корректного отображения ошибки
        });

        req.write(data);
        req.end();
    });
}
module.exports = { fetchOpenAIResponse };
