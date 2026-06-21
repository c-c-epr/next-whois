ARG NODE_VERSION=22.13.0
FROM node:${NODE_VERSION}-alpine AS base

ARG COREPACK_VERSION=0.33.0

WORKDIR /app

RUN npm install -g corepack@${COREPACK_VERSION} \
 && corepack enable

FROM base AS deps

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

FROM deps AS builder

COPY . .
RUN pnpm build

FROM node:${NODE_VERSION}-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

COPY --from=builder /app/public ./public
COPY --from=builder /app/locales ./locales

EXPOSE 3000

CMD ["node", "server.js"]