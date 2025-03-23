FROM oven/bun

WORKDIR /app

COPY package.json .
COPY bun.lock .

RUN bun install --production

COPY src src
COPY public public
COPY tsconfig.json ./

ENV TZ Asia/Bangkok
ENV NODE_ENV production
CMD ["bun", "src/app.ts"]

EXPOSE 3000
