import { Elysia } from 'elysia'
import libWinston from 'winston'
import LokiTransport from 'winston-loki'

export const winston = new Elysia({
  name: 'winston',
}).derive({ as: 'global' }, async () => {
  const logger = libWinston.createLogger({
    format: libWinston.format.combine(
      libWinston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      libWinston.format.printf(
        ({ timestamp, level, message }) =>
          `${timestamp} ${level.toUpperCase()}: ${message}`
      )
    ),
    transports: [
      ...(process.env.LOKI_HOST
        ? [
            new LokiTransport({
              host: process.env.LOKI_HOST,
              headers: {
                ...(process.env.LOKI_CF_ID && {
                  'cf-access-client-id': process.env.LOKI_CF_ID,
                }),
                ...(process.env.LOKI_CF_SECRET && {
                  'cf-access-client-secret': process.env.LOKI_CF_SECRET,
                }),
              },
              labels: {
                service_name: 'music-profile',
                environment: process.env.NODE_ENV ?? 'unknown',
              },
              json: true,
              batching: true,
              interval: 5,
              onConnectionError: err => console.error(err),
            }),
          ]
        : []),
    ],
  })

  return { logger }
})
