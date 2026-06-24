FROM oven/bun:1-slim
WORKDIR /app
COPY package.json bun.lock bunfig.toml ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build
EXPOSE 4173
CMD ["bun", "run", "preview"]
