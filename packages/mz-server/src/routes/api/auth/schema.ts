import { Type } from '@fastify/type-provider-typebox'
import { UserSchema } from '../../../schema/UserSchema.js'
import { createAppErrorSchema } from '../../../lib/AppError.js'
import { RoutesType } from '../../../lib/routeSchema.js'
import { createRouteSchema } from '../../../lib/routeSchema.js'

export const AuthBody = Type.Object({
  username: Type.String(),
  password: Type.String(),
})

const TokenSchema = Type.Object({
  accessToken: Type.String(),
  refreshToken: Type.String(),
})

const AuthResult = Type.Object({
  tokens: TokenSchema,
  user: UserSchema,
})

export const AuthRouteSchema = createRouteSchema({
  Login: {
    tags: ['auth'],
    body: AuthBody,
    response: {
      200: AuthResult,
      401: createAppErrorSchema({
        name: 'AuthenticationError',
        message: 'Invalid username or password',
        statusCode: 401,
      }),
    },
  },
  Register: {
    tags: ['auth'],
    body: AuthBody,
    response: {
      200: AuthResult,
      409: createAppErrorSchema({
        name: 'UserExistsError',
        message: 'User already exists',
        statusCode: 409,
      }),
    },
  },
  RefreshToken: {
    tags: ['auth'],
    body: Type.Object({
      refreshToken: Type.Optional(Type.String()),
    }),
    response: {
      200: TokenSchema,
      401: createAppErrorSchema({
        name: 'RefreshTokenError',
        message: 'Invalid refresh token',
        statusCode: 401,
      }),
    },
  },
  Logout: {
    tags: ['auth'],
    response: {
      204: Type.Null(),
    },
  },
})

export type AuthRoute = RoutesType<typeof AuthRouteSchema>
