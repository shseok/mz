import { Type } from '@fastify/type-provider-typebox'
import { ItemParamsSchema } from '../schema.js'
import { Nullable } from '../../../../lib/typebox.js'
import { RoutesType, createRouteSchema } from '../../../../lib/routeSchema.js'
import { UserSchema } from '../../../../schema/UserSchema.js'

const CreateCommentBodySchema = Type.Object({
  text: Type.String(),
  parentCommentId: Type.Optional(Nullable(Type.Integer())),
})

// 대댓글 작성, 대댓글 리스팅, 좋아요에 사용
/** @todos 헷갈리므로 id > itemId로 변경하기 */
const CommentsParamsSchema = Type.Object({
  id: Type.Integer(),
  commentId: Type.Integer(),
})

const UpdateCommentSchema = Type.Object({
  text: Type.String(),
})

export let CommentSchema = Type.Object({
  id: Type.Integer(),
  text: Type.String(),
  createdAt: Type.String(),
  updatedAt: Type.String(),
  likes: Type.Integer(),
  subcommentsCount: Type.Integer(),
  user: UserSchema,
  mentionUser: Type.Optional(Nullable(UserSchema)),
  isDeleted: Type.Boolean(),
  isLiked: Type.Boolean(),
})
//CreateComment response에도 쓰이므로 subcomments는 optional
CommentSchema = Type.Object({
  id: Type.Integer(),
  text: Type.String(),
  createdAt: Type.String(),
  updatedAt: Type.String(),
  likes: Type.Integer(),
  subcommentsCount: Type.Integer(),
  user: UserSchema,
  mentionUser: Type.Optional(Nullable(UserSchema)),
  isDeleted: Type.Boolean(),
  isLiked: Type.Boolean(),
  subcomments: Type.Optional(Type.Array(CommentSchema)),
})

const CommentLikeSchema = Type.Object({
  id: Type.Integer(),
  likes: Type.Number(),
})

export const CommentsRouteSchema = createRouteSchema({
  GetComments: {
    tags: ['comments'],
    params: ItemParamsSchema,
    response: {
      200: Type.Array(CommentSchema),
    },
  },
  GetComment: {
    tags: ['comments'],
    params: CommentsParamsSchema,
    response: {
      200: CommentSchema,
    },
  },
  GetSubcomments: {
    tags: ['comments'],
    params: CommentsParamsSchema,
    response: {
      200: Type.Array(CommentSchema),
    },
  },
  CreateComment: {
    tags: ['comments'],
    params: ItemParamsSchema,
    body: CreateCommentBodySchema,
    response: {
      200: CommentSchema,
    },
  },
  LikeComment: {
    tags: ['comments'],
    params: CommentsParamsSchema,
    response: {
      200: CommentLikeSchema,
    },
  },
  UnlikeComment: {
    tags: ['comments'],
    params: CommentsParamsSchema,
    response: {
      200: CommentLikeSchema,
    },
  },
  DeleteComment: {
    tags: ['comments'],
    params: CommentsParamsSchema,
    response: {
      204: {},
    },
  },
  UpdateComment: {
    tags: ['comments'],
    params: CommentsParamsSchema,
    body: UpdateCommentSchema,
    response: {
      200: CommentSchema,
    },
  },
})

export type CommentsRoute = RoutesType<typeof CommentsRouteSchema>

// 리팩토링: 아래의 여러 코드 > 위의 한줄 코드

// type CreateCommentBodyType = Static<typeof CreateCommentBodySchema>
// type CommentsParamsType = Static<typeof CommentsParamsSchema>
// type UpdateCommentType = Static<typeof UpdateCommentSchema>

// export type CommentsRoute = {
//   GetComments: {
//     Params: ItemParamsType
//   }
//   CreateComment: {
//     Params: ItemParamsType
//     Body: CreateCommentBodyType
//   }
//   GetSubcomments: {
//     Params: CommentsParamsType
//   }
//   LikeComment: {
//     Params: CommentsParamsType
//   }
//   UnlikeComment: {
//     Params: CommentsParamsType
//   }
//   DeleteComment: {
//     Params: CommentsParamsType
//   }
//   UpdateComment: {
//     Params: CommentsParamsType
//     Body: UpdateCommentType
//   }
// }
