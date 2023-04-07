# Builder stage
FROM node:18 AS ts-builder

WORKDIR /app
COPY package.json ./
COPY tsconfig.json ./

RUN npm install -g npm@9.6.4
RUN npm install
ADD ./src /app/src
RUN npm run tsc

# Runner Stage
FROM node:18 as ts-runner
RUN apk update
RUN apk add
RUN apk add ffmpeg

WORKDIR /app
COPY --from=ts-builder ./app/build ./build

COPY package* ./
RUN npm install --global yarn
RUN yarn

COPY ./ ./

CMD ["node", "build/index.js"]
