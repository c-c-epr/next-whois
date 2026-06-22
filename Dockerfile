ARG NODE_VERSION=26.3.1
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
ENV HOSTNAME=0.0.0.0

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

COPY --from=builder /app/public ./public
COPY --from=builder /app/locales ./locales

EXPOSE 3000

HEALTHCHECK --interval=10s --timeout=5s --start-period=10s --retries=5 \
	CMD ["node", "-e", "fetch('http://127.0.0.1:3000/api/health').then(async (response) => { console.log(`HTTP ${response.status}`); process.exit(response.status === 200 ? 0 : 1); }).catch((error) => { console.error(error.message); process.exit(1); })"]

CMD ["sh", "-c", "HOSTNAME=0.0.0.0 exec node server.js"]