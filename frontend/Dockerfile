FROM node:18-alpine

WORKDIR /app


COPY package*.json ./
RUN npm install

COPY . .

# Exponemos el puerto 3000 de React
EXPOSE 3000

CMD ["npm", "start"]