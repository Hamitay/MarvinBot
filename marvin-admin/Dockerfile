# Builder stage
FROM node:16-alpine3.11 as ts-builder

WORKDIR /app
COPY package.* ./
COPY tsconfig.json ./

ADD ./prisma prisma
ADD ./src src

RUN npm install
RUN npx prisma generate

RUN npm run tsc

# Runner stage
FROM node:16-alpine3.11 as ts-runner
WORKDIR  /app
COPY --from=ts-builder ./app/dist ./dist
COPY --from=ts-builder ./app/prisma ./dist/prisma
COPY --from=ts-builder ./app/node_modules ./dist/node_modules

CMD ["node", "dist/src/index.js"]