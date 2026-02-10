# Stage 1: Build the React Client
FROM oven/bun:1 AS client-build

WORKDIR /app/client
COPY client/package.json client/bun.lockb ./
RUN bun install

COPY client ./
RUN bun run build

# Stage 2: Build the Backend Server
FROM oven/bun:1 AS server-build

WORKDIR /app/server
COPY server/package.json server/bun.lockb ./
RUN bun install

COPY server ./

# Validating folder structure for deployment
RUN mkdir -p public

# Copy client build to server public directory (if you want server to serve client)
# Assuming typical simpler deployment where server serves static files from 'public' or similar
COPY --from=client-build /app/client/dist ./public

# Final Runtime Image
FROM oven/bun:1

WORKDIR /app

# Copy built server and dependencies
COPY --from=server-build /app/server ./

# Expose the API port
EXPOSE 5000

# Start command
CMD ["bun", "src/app.js"]
