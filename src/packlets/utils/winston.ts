import { Elysia } from 'elysia'
import { createLogger } from '@rayriffy/analytics'
import { dummyLogger } from './dummyLogger'

export const winston = new Elysia({
  name: 'winston',
}).derive({ as: 'global' }, () => {
  const logger = process.env.LOKI_HOST ? createLogger({
    host: process.env.LOKI_HOST,
    serviceName: 'music-profile',
    headers: {
      ...(process.env.LOKI_CF_ID && {
        'cf-access-client-id': process.env.LOKI_CF_ID,
      }),
      ...(process.env.LOKI_CF_SECRET && {
        'cf-access-client-secret': process.env.LOKI_CF_SECRET,
      }),
    },
    metadata: {
      environment: process.env.NODE_ENV ?? 'unknown',
    },
  }) : dummyLogger

  return { logger }
})
