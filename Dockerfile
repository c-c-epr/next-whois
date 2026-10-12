FROM node:22.13-alpine

WORKDIR /app

COPY . .

RUN npm install -g pnpm
RUN pnpm install

RUN pnpm build --webpack

ENV NODE_ENV=production

EXPOSE 3000

CMD ["pnpm", "start"]
