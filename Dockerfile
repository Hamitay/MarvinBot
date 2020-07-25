FROM node:alpine
RUN apk add  --no-cache ffmpeg

WORKDIR /app

COPY package.json ./
COPY config.json ./
RUN npm i

COPY ./ ./

CMD ["node", "index.js"]
