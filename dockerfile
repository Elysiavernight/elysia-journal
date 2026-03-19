FROM oven/bun:latest

WORKDIR /app

# Copy dependency files
COPY package.json bun.lock ./

# Install dependencies
RUN bun install

# Copy the rest 
COPY . .

# Expose the port your Elysia app runs on
EXPOSE 7000

# Just run the app directly!
CMD ["bun", "src/index.ts"]