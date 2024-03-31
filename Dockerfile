# Установите базовый образ alpine
FROM node:alpine

# Установите PM2 глобально внутри образа
RUN npm install pm2 -g

# Установите рабочую директорию в контейнере
WORKDIR /app

# Копируйте файлы package.json и package-lock.json
COPY package*.json ./

# Установите зависимости проекта
RUN npm install

# Копируйте исходный код приложения
COPY . .

# Соберите приложение
RUN npm run build

# Определите порт, который будет прослушивать приложение
EXPOSE 3000

# Запуск приложения с помощью PM2
CMD ["pm2-runtime", "start", "npm", "--", "start"]
