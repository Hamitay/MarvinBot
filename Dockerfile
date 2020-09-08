FROM node:alpine
RUN apk add  --no-cache ffmpeg

WORKDIR /app

COPY package.json ./
COPY config.json ./
RUN npm i

COPY ./ ./

ARG DISCORD_TOKEN
ENV DISCORD_TOKEN=${DISCORD_TOKEN}

CMD ["node", "index.js"]
