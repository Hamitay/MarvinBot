# Builder stage
FROM node:16.9.0-alpine as ts-builder

WORKDIR /app
COPY package.json ./
COPY tsconfig.json ./

RUN npm install
ADD ./src /app/src
RUN npm run tsc

# Runner Stage
FROM node:16.9.0-alpine as ts-runner
RUN apk add  --no-cache ffmpeg

WORKDIR /app
COPY --from=ts-builder ./app/build ./build

COPY package* ./
RUN npm i

COPY ./ ./

CMD ["node", "build/index.js"]
