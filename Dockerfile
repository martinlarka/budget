FROM node:8.5.0-alpine

RUN mkdir -p /app
WORKDIR /app

COPY package.json /app
RUN npm install --quiet

COPY . /app

EXPOSE 3000
CMD ["node", "server.js"]
