# Stage 1: Build Stage
FROM node:20-slim as build-stage

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .
RUN npm run build

# Stage 2: Production Stage (Nginx)
FROM nginx:stable-alpine as production-stage

# Copy the build output from Stage 1 to Nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy a custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

