FROM node:20-slim AS builder

RUN npm i -g pnpm

RUN mkdir -p /opt && \
    cp -a --parents /usr/lib/*/libz.* /opt

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
COPY ./patches ./patches
RUN pnpm -r i --frozen-lockfile && pnpm patch art-template

COPY next.config.js next-env.d.ts postcss.config.js tailwind.config.js tsconfig.json ./
COPY ./src ./src
COPY ./public ./public
COPY ./prisma ./prisma

RUN pnpm build

# ? -------------------------

FROM gcr.io/distroless/nodejs20-debian11 AS runner

WORKDIR /app
EXPOSE 3000

ENV PORT 3000
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=builder /opt /

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

CMD ["server.js"]
