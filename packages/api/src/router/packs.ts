import { z } from 'zod'

import { createTRPCRouter, privateProcedure, publicProcedure } from '../trpc'
import { TRPCError } from '@trpc/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis/nodejs'
import { clerkClient } from '@clerk/nextjs'
import { type Pack } from '@prisma/client'
import { filterUserForClient } from '../helpers/filterUserForClient'
import { Prisma } from '@prisma/client'
import { errorHandler } from '../helpers/errorHandler'

type AuthorWithPack = Prisma.AuthorGetPayload<{
  include: {
    packs: true
  }
}>

const addUserDataToPack = async (authors: AuthorWithPack[]) => {
  const users = (
    await clerkClient.users.getUserList({
      userId: authors.map((author) => author.authorId),
      limit: 100,
    })
  ).map(filterUserForClient)

  return authors.map((author) => {
    const authorInfo = users.find((user) => author.authorId === user.id)

    if (!author?.authorId) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: JSON.stringify(users),
        // 'Author for pack not found',
        // users:
      })
    }
    return {
      author,
      authorInfo,
    }
  })
}

// Create a new ratelimiter, that allows 10 requests per 10 seconds
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  analytics: true,
  /**
   * Optional prefix, useful if you want to share a redis
   * instance with other applications and want to avoid key collisions. The default prefix is
   * "@upstash/ratelimit"
   */
  prefix: '@upstash/share-your-backpack',
})

export const packsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const packs = await ctx.prisma.author.findMany({
      include: {
        packs: true,
      },
    })

    // TODO: get only user packs, convert the getAll to getLatestAdded()
    return addUserDataToPack(packs)
  }),
  getPackById: publicProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    const pack = await ctx.prisma.pack.findUnique({
      where: { packId: input.id },
      include: {
        packItems: {
          include: { itemSelection: { include: { item: true } } },
        },
        author: true,
      },
    })
    if (!pack) throw new TRPCError({ code: 'NOT_FOUND' })

    return pack
  }),
  getUser: publicProcedure
    .input(z.object({ authorId: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.author.findUnique({
        where: { authorId: input.authorId },
      })
      if (!user) throw new TRPCError({ code: 'NOT_FOUND' })

      return user
    }),
  getItems: privateProcedure.query(async ({ ctx }) => {
    // find all the unique packItems among all the packs of a single user
    const authorId = ctx.userId
    const userItems = await ctx.prisma.item.findMany({
      where: { itemAuthorId: authorId },
    })
    return userItems
  }),

  search: publicProcedure.input(z.object({ value: z.string() })).query(async ({ ctx, input }) => {
    //TODO: To be tested
    const result = await ctx.prisma.pack.findMany({
      where: {
        name: {
          search: `${input.value}*`,
        },
        description: {
          search: `${input.value}*`,
        },
      },
    })
    if (!result) throw new TRPCError({ code: 'NOT_FOUND' })

    return result
  }),
  searchAllItems: privateProcedure
    .input(z.object({ value: z.string(), limit: z.number(), page: z.number() }))
    .query(async ({ ctx, input }) => {
      const searchArr = input.value.split(' ').filter((x) => x)
      let searchVal
      switch (searchArr.length) {
        case 1:
          searchVal = `${searchArr[0]}*`
          break
        default:
          searchVal = searchArr
            .map((val, ind) => (ind === searchArr.length - 1 ? `+${val}*` : `+"${val}"`))
            .join(' ')
      }

      const { success } = await ratelimit.limit(ctx.userId)

      if (!success) throw new TRPCError({ code: 'TOO_MANY_REQUESTS' })
      const result = await ctx.prisma.item.findMany({
        where: {
          name: {
            search: input.value ? searchVal : '',
          },
          brand: {
            search: input.value ? searchVal : '',
          },
        },
        take: input.limit,
        skip: (input.page - 1) * input.limit,
      })
      if (!result) throw new TRPCError({ code: 'NOT_FOUND' })

      return result
    }),

  createPack: privateProcedure
    .input(
      z.object({
        name: z.string().min(1).max(200),
        description: z.string().optional(),
        // packItems: z
        //   .object({
        //     name: z.string().min(1).max(200),
        //   })
        //   .array()
        //   .optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId

      let pack: Pack
      try {
        pack = await ctx.prisma.pack.create({
          data: {
            name: input.name,
            description: input.description,
            author: {
              connectOrCreate: { where: { authorId: authorId }, create: { authorId: authorId } },
            },
          },
          // packItems: {
          //   create: input.packItems,
          // },
        })
        return pack
      } catch (err) {
        errorHandler(err)
      }
    }),

  editPack: privateProcedure
    .input(
      z.object({
        packId: z.string(),
        name: z.string().min(1).max(200),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId

      const { success } = await ratelimit.limit(authorId)

      if (!success) throw new TRPCError({ code: 'TOO_MANY_REQUESTS' })
      try {
        await ctx.prisma.pack.update({
          where: { packId: input.packId },
          data: { ...input },
        })
      } catch (err) {
        errorHandler(err)
      }
      return 'ok'
    }),

  deletePack: privateProcedure
    .input(
      z.object({
        packId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId

      const { success } = await ratelimit.limit(authorId)

      if (!success) throw new TRPCError({ code: 'TOO_MANY_REQUESTS' })
      try {
        await ctx.prisma.$transaction([
          ctx.prisma.pack.update({
            where: {
              packId: input.packId,
            },
            data: {
              packItems: {
                deleteMany: {},
              },
            },
            include: {
              packItems: {},
            },
          }),
          ctx.prisma.pack.delete({
            where: { packId: input.packId },
          }),
        ])
      } catch (err) {
        errorHandler(err)
      }
      return 'ok'
    }),
  addPackItem: privateProcedure
    .input(
      z.object({
        packId: z.string(),
        packItem: z.object({
          itemId: z.string().optional(),
          name: z.string().min(1).max(200),
          category: z.string().optional(),
          location: z.string().optional(),
          quantity: z.number().optional(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId

      const { success } = await ratelimit.limit(authorId)

      if (!success) throw new TRPCError({ code: 'TOO_MANY_REQUESTS' })
      try {
        await ctx.prisma.$transaction(async (prisma) => {
          let item
          if (!input.packItem.itemId) {
            // Step 1: Create a new Item if itemId is not provided
            item = await prisma.item.create({
              data: {
                name: input.packItem.name,
                author: {
                  connect: { authorId },
                },
                selections: { create: [{ itemSelectionAuthorId: authorId }] },
              },
              include: {
                selections: true,
              },
            })
          } else {
            item = await prisma.item.findUnique({
              where: { itemId: input.packItem.itemId },
              include: {
                selections: {
                  where: { itemSelectionAuthorId: authorId },
                },
              },
            })
            // item is present, check if author has already selected the item

            if (item?.selections.length > 0) {
              // author has already selected the item, so just add the packItem

              const newPackItem = await prisma.packItem.create({
                data: {
                  itemSelection: {
                    connect: { selectionId: item.selections[0].selectionId },
                  },
                  pack: { connect: { packId: input.packId } },
                  quantity: input.packItem.quantity || 1,
                  category: input.packItem.category || '',
                  location: input.packItem.location || '',
                },
              })

              return 'ok'
            } else {
              // author has not selected the item, so select the item and add the packItem
              item = await prisma.item.update({
                where: { itemId: input.packItem.itemId },
                data: {
                  selections: {
                    create: [
                      {
                        itemSelectionAuthorId: authorId,
                        packItem: {
                          create: [
                            {
                              pack: { connect: { packId: input.packId } },
                              quantity: input.packItem.quantity,
                              category: input.packItem.category,
                              location: input.packItem.location,
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              })
            }
          }
        })
      } catch (err) {
        errorHandler(err)
      }
      return 'ok'
    }),

  editPackItem: privateProcedure
    .input(
      z.object({
        packId: z.string(),
        packItemId: z.string(),
        itemId: z.string().optional(),
        name: z.string().min(1).max(200).optional(),
        category: z.string().optional(),
        location: z.string().optional(),
        quantity: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId

      const { success } = await ratelimit.limit(authorId)

      if (!success) throw new TRPCError({ code: 'TOO_MANY_REQUESTS' })
      let updatedPackItem
      try {
        updatedPackItem = await ctx.prisma.$transaction(async (prisma) => {
          // if author is the owner of the item in the selection, edit the name
          // get the item whose packItem is being edited
          // const packItem = await prisma.packItem.findUnique({
          //   where: { packItemId: input.packItemId },
          //   include: {
          //     itemSelection: true,
          //   },
          // })
          const updatedPackItem = prisma.pack.update({
            where: { packId: input.packId },
            data: {
              packItems: {
                update: {
                  where: {
                    packItemId: input.packItemId,
                  },
                  data: {
                    location: input.location,
                    category: input.category,
                    quantity: input.quantity,
                    itemSelection: {
                      update: {
                        data: {
                          item: {
                            update: {
                              data: {
                                name: input.name,
                              },
                              where: {
                                itemId: input.itemId,
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            include: {
              packItems: {
                include: {
                  itemSelection: {
                    include: {
                      item: true,
                    },
                  },
                },
              },
            },
          })
          return updatedPackItem
        }) // end of transaction
      } catch (err) {
        errorHandler(err)
      }
      return updatedPackItem
    }),
  deletePackItem: privateProcedure
    .input(
      z.object({
        packId: z.string(),
        packItemId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId

      const { success } = await ratelimit.limit(authorId)

      if (!success) throw new TRPCError({ code: 'TOO_MANY_REQUESTS' })
      try {
        await ctx.prisma.pack.update({
          where: { packId: input.packId },
          data: {
            packItems: {
              delete: {
                packItemId: input.packItemId,
              },
            },
          },
          include: {
            packItems: true,
          },
        })
      } catch (err) {
        errorHandler(err)
      }
      return 'ok'
    }),
  addItem: privateProcedure
    .input(
      z.object({
        name: z.string().min(1).max(200),
        brand: z.string().optional(),
        itemUrl: z.string().optional(),
        imageUrl: z.string().optional(),
        weight: z.coerce.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId

      const { success } = await ratelimit.limit(authorId)

      if (!success) throw new TRPCError({ code: 'TOO_MANY_REQUESTS' })
      try {
        await ctx.prisma.item.create({
          data: {
            name: input.name,
            brand: input.brand,
            weight: input.weight,
            itemUrl: input.itemUrl,
            imageUrl: input.imageUrl,
            author: {
              connect: { authorId: authorId },
            },
          },
        })
      } catch (err) {
        errorHandler(err)
      }
      return 'ok'
    }),

  editItem: privateProcedure
    .input(
      z.object({
        itemId: z.string(),
        name: z.string().min(1).max(200),
        brand: z.string().optional(),
        weight: z.coerce.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId

      const { success } = await ratelimit.limit(authorId)

      if (!success) throw new TRPCError({ code: 'TOO_MANY_REQUESTS' })
      try {
        await ctx.prisma.item.update({
          where: { itemId: input.itemId },
          data: {
            name: input.name,
            brand: input.brand,
            weight: input.weight,
            itemAuthorId: authorId,
          },
        })
      } catch (err) {
        errorHandler(err)
      }
      return 'ok'
    }),
  deleteItem: privateProcedure
    .input(
      z.object({
        itemId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId

      const { success } = await ratelimit.limit(authorId)

      if (!success) throw new TRPCError({ code: 'TOO_MANY_REQUESTS' })
      try {
        await ctx.prisma.item.delete({
          where: { itemId: input.itemId, itemAuthorId: authorId },
        })
      } catch (err) {
        errorHandler(err)
      }
      return 'ok'
    }),
})
