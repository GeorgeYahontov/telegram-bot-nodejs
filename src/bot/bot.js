const http = require('http');
const https = require('https');
const { StringDecoder } = require('string_decoder');
const { fetchOpenAIResponse } = require('./openaiService');
const decoder = new StringDecoder('utf-8');

const TELEGRAM_BOT_TOKEN = '7087251078:AAHE2Y-TRQm1NEqqKT3FBz6AWAdKlGb-xEE';

const server = http.createServer((req, res) => {
    if (req.method === 'POST') {
        let buffer = '';

        req.on('data', function(data) {
            buffer += decoder.write(data);
        });

        req.on('end', function() {
            buffer += decoder.end();

            const parsedMessage = JSON.parse(buffer);
            if (parsedMessage.message && parsedMessage.message.text) {
                // Логика обработки текстового сообщения
                console.log(`Received message: ${parsedMessage.message.text}`);
                // Получаем ответ от OpenAI
                fetchOpenAIResponse(parsedMessage.message.text)
                    .then(replyText => {
                        // Отправляем ответ пользователю
                        sendTextMessage(parsedMessage.message.chat.id, replyText);
                    })
                    .catch(error => {
                        console.error("Error fetching response from OpenAI:", error);
                        sendTextMessage(parsedMessage.message.chat.id, "Извините, произошла ошибка при обработке вашего запроса.");
                    });
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.end('OK\n');
        });
    } else {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Hello World\n');
    }
});

function sendTextMessage(chatId, text) {
    const postData = JSON.stringify({
        chat_id: chatId,
        text: text,
    });

    const options = {
        hostname: 'api.telegram.org',
        port: 443, // HTTPS порт
        path: `/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, // Исправлено на шаблонную строку
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData),
        },
    };

    const req = https.request(options, (res) => {
        console.log(`STATUS: ${res.statusCode}`);
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
        });
        res.on('end', () => {
            console.log('No more data in response.');
        });
    });

    req.on('error', (e) => {
        console.error(`Problem with request: ${e.message}`);
    });

    // Write data to request body
    req.write(postData);
    req.end();
}

const port = 3000;
const hostname = '0.0.0.0';

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
