import AppError from '../lib/AppError.js'
import db from '../lib/db.js'
import { PaginationOptionType, createPagination } from '../lib/pagination.js'
import { CreateItemBodyType } from '../routes/api/items/schema.js'

class ItemService {
  private static instance: ItemService
  public static getInstance(): ItemService {
    if (!ItemService.instance) {
      ItemService.instance = new ItemService()
    }
    return ItemService.instance
  }

  async createItem(
    userId: number,
    { title, body, link, tags }: CreateItemBodyType,
  ) {
    const item = await db.item.create({
      data: {
        title,
        body,
        link,
        userId,
      },
      include: {
        user: true,
      },
    })

    return item
  }

  async getItem(id: number) {
    const item = await db.item.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
      },
    })
    if (!item) {
      throw new AppError('NotFoundError')
    }
    return item
  }

  async getPulicItems(
    params: GetPublicItemsParams & PaginationOptionType = { mode: 'recent' },
  ) {
    const limit = params.limit ?? 20
    if (params.mode === 'recent') {
      const [totalCount, list] = await Promise.all([
        db.item.count(),
        db.item.findMany({
          orderBy: {
            createdAt: 'desc',
          },
          where: {
            id: params.cursor
              ? {
                  lt: params.cursor,
                }
              : undefined,
          },
          include: {
            user: true,
          },
          take: limit,
        }),
      ])
      const endCursor = list.at(-1)?.id ?? null
      const hasNextPage = endCursor
        ? (await db.item.count({
            where: { id: { lte: endCursor } },
            orderBy: { createdAt: 'desc' },
          })) > 0
        : false
      return createPagination({
        list,
        totalCount,
        pageInfo: {
          endCursor,
          hasNextPage,
        },
      })
    }

    return []
  }

  async updateItem({ itemId, userId, title, body }: UpdateItemParams) {
    const item = await this.getItem(itemId)
    if (item.userId !== userId) {
      throw new AppError('ForbiddenError')
    }
    const updatedItem = await db.item.update({
      where: {
        id: itemId,
      },
      data: {
        title,
        body,
      },
      include: {
        user: true,
      },
    })
    return updatedItem
  }
}
export default ItemService

type GetPublicItemsParams =
  | { mode: 'trending' | 'recent' }
  | { mode: 'past'; date: string }

interface UpdateItemParams {
  itemId: number
  userId: number
  title: string
  body: string
}
