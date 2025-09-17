FROM node:22.11.0-alpine

WORKDIR /app

COPY ./app/package.json ./

RUN npm install

COPY ./app .

CMD ["npm", "dev"]