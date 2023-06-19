FROM cgr.dev/chainguard/node:18 AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
COPY ./patches ./patches
RUN npx pnpm -r i --frozen-lockfile && npx pnpm patch art-template

COPY next.config.js next-env.d.ts postcss.config.js tailwind.config.js tsconfig.json ./
COPY ./src ./src
COPY ./public ./public
COPY ./prisma ./prisma

RUN npx pnpm build

# ? -------------------------

FROM cgr.dev/chainguard/node:18 AS runner

EXPOSE 3000

ENV PORT 3000
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

CMD ["server.js"]
