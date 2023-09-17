FROM node:20-alpine AS builder

WORKDIR /app

RUN npm i -g pnpm

COPY package.json pnpm-lock.yaml* ./
COPY ./patches ./patches
RUN pnpm -r i --frozen-lockfile && pnpm patch art-template

COPY next.config.js next-env.d.ts postcss.config.js tailwind.config.js tsconfig.json ./
COPY ./src ./src
COPY ./public ./public
COPY ./prisma ./prisma

RUN pnpm build

# ? -------------------------

FROM node:20-alpine AS runner

WORKDIR /app
EXPOSE 3000

ENV PORT 3000
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

CMD ["server.js"]
