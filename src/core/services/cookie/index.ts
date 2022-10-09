import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next'
import type { NextRequest } from 'next/server'
import { get } from './get'
import { remove } from './remove'
import { set } from './set'

export type PossibleRequests = NextApiRequest | GetServerSidePropsContext['req'] | NextRequest
export type PossibleResponses = NextApiResponse  | GetServerSidePropsContext['res']

export const cookie = (req: PossibleRequests, res?: PossibleResponses) => {
  return {
    get: (name: string) => get(req, name),
    set: (name: string, value: string) => set(res, name, value),
    remove: (name: string) => remove(res, name)
  }
}
