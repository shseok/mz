import { FastifyPluginAsync } from 'fastify'
import {
  DeleteItemRoute,
  DeleteItemSchema,
  GetItemRoute,
  GetItemSchema,
  GetItemsRoute,
  GetItemsSchema,
  LikeItemRoute,
  LikeItemSchema,
  UnlikeItemRoute,
  UnlikeItemSchema,
  UpdateItemRoute,
  UpdateItemSchema,
  WriteItemRoute,
  WriteItemSchema,
} from './schema.js'
import { createAuthorizedRoute } from '../../../plugins/requireAuthPlugin.js'
import ItemService from '../../../services/ItemService.js'
import { commentsRoute } from './comments/index.js'

export const itemsRoute: FastifyPluginAsync = async (fastify) => {
  const itemService = ItemService.getInstance()
  // fastify.register(async (fastify) => {
  //   fastify.register(requireAuthPlugin)
  //   fastify.post<WriteItemRoute>(
  //     '/',
  //     { schema: writeItemSchema },
  //     async (request) => {
  //       return null
  //     },
  //   )
  // })

  fastify.register(authorizedItemRoute(itemService)) // refactoring above code
  fastify.get<GetItemRoute>(
    '/:id',
    { schema: GetItemSchema },
    async (request) => {
      const { id } = request.params
      const item = await itemService.getItem(id, request.user?.id)
      if (item) {
        return item
      }
      return null
    },
  )

  fastify.get<GetItemsRoute>(
    '/',
    { schema: GetItemsSchema },
    async (request) => {
      const { cursor, mode, startDate, endDate } = request.query
      return itemService.getItems({
        mode: mode ?? 'recent',
        cursor: cursor ? parseInt(cursor, 10) : null,
        userId: request.user?.id,
        limit: 20,
        startDate,
        endDate,
      })
    },
  )

  fastify.register(commentsRoute, { prefix: '/:id/comments' })
}

const authorizedItemRoute = (itemService: ItemService) =>
  createAuthorizedRoute(async (fastify) => {
    // const itemService = ItemService.getInstance()
    fastify.post<WriteItemRoute>(
      '/',
      { schema: WriteItemSchema },
      async (request) => {
        const item = await itemService.createItem(
          request.user!.id, // authorizedItemRoute때문에 무조건 존재 => !
          request.body,
        )
        return item
      },
    )

    fastify.patch<UpdateItemRoute>(
      '/:id',
      { schema: UpdateItemSchema },
      async (request) => {
        const { id: itemId } = request.params
        const userId = request.user!.id
        const { title, body } = request.body
        return itemService.updateItem({ userId, itemId, title, body })
      },
    )

    fastify.delete<DeleteItemRoute>(
      '/:id',
      { schema: DeleteItemSchema },
      async (request, reply) => {
        const { id: itemId } = request.params
        const userId = request.user!.id
        await itemService.deleteItem({ userId, itemId })
        reply.status(204)
      },
    )

    fastify.post<LikeItemRoute>(
      '/:id/likes',
      { schema: LikeItemSchema },
      async (request) => {
        const { id: itemId } = request.params
        const userId = request.user!.id
        const itemStats = await itemService.likeItem({ userId, itemId })
        return { id: itemId, itemStats, isLiked: true }
      },
    )

    fastify.delete<UnlikeItemRoute>(
      '/:id/likes',
      { schema: UnlikeItemSchema },
      async (request) => {
        const { id: itemId } = request.params
        const userId = request.user!.id
        const itemStats = await itemService.unlikeItem({ userId, itemId })
        return { id: itemId, itemStats, isLiked: false }
      },
    )
  })
