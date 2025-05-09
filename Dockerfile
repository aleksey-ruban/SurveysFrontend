FROM node:18-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package*.json ./
RUN npm install

# Копируем остальной код
COPY . .

# Открываем порт, если приложение слушает его (например, 3000)
EXPOSE 8081

# Запускаем сервер
CMD ["npm", "start"]