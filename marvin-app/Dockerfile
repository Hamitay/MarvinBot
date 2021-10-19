# Builder stage
FROM node:16-alpine3.11 as builder

WORKDIR /app
COPY package.* ./
COPY tsconfig.json ./

RUN npm install

COPY . /app

#ENV API_URL=http://marvin.hamitay/api
RUN npm run build

# Runner stage
FROM nginx:alpine
# Set working directory to nginx asset directory
WORKDIR /usr/share/nginx/html
# Remove default nginx static assets
RUN rm -rf ./*
# Copy static assets from builder stage
COPY --from=builder /app/build .

# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]