# CLIENT
WORKDIR /app/client
COPY client/package.json ./
RUN bun install

# SERVER
WORKDIR /app/server
COPY server/package.json ./
RUN bun install
