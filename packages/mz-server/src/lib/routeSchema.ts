import { Static, TSchema } from '@fastify/type-provider-typebox'
import { FastifySchema } from 'fastify'

type RouteSchema = {
  params?: TSchema
  body?: TSchema
  querystring?: TSchema
  response?: unknown
}

type RouteType<T extends RouteSchema> = {
  Params: T['params'] extends TSchema ? Static<T['params']> : never
  Body: T['body'] extends TSchema ? Static<T['body']> : never
  Querystring: T['querystring'] extends TSchema
    ? Static<T['querystring']>
    : never
}

export type RoutesType<T extends Record<string, RouteSchema>> = {
  [K in keyof T]: RouteType<T[K]>
}

// for auto complete
export function createRouteSchema<T extends Record<string, FastifySchema>>(
  params: T,
) {
  return params
}

export function routeSchema<T extends FastifySchema>(schema: T) {
  return schema
}
