# Builder stage
FROM node:16-alpine3.11 as ts-builder

WORKDIR /app
COPY package.* ./
COPY tsconfig.json ./

ADD ./prisma /app/prisma
ADD ./src /app/src

RUN npm install
RUN npx prisma generate

RUN npm run tsc

# Runner stage
FROM node:16-alpine3.11 as ts-runner
WORKDIR  /app
COPY --from=ts-builder ./app/dist ./app/dist
COPY --from=ts-builder ./app/prisma ./app/dist/prisma
COPY --from=ts-builder ./app/node_modules ./app/dist/node_modules

CMD ["node", "app/dist/src/index.js"]