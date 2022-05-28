FROM node:18-alpine

EXPOSE 48004

WORKDIR /app
COPY ./app/ ./
RUN npm install && npm run build

WORKDIR /server
COPY ./server/ ./
RUN npm install

CMD ["npm", "start"]