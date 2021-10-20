# Builder stage
FROM node:16-alpine3.11 as builder

WORKDIR /app
COPY package.* ./
COPY tsconfig.json ./

RUN npm install

COPY . /app

ENV API_URL=http://marvin.hamitay.com/api
RUN npm run build

# Runner stage
FROM nginx:alpine

COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY nginx/nginx_prod.conf /etc/nginx/conf.d/prod.conf

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=builder /app/build .

# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]