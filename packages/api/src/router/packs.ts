import { z } from 'zod'

import { createTRPCRouter, privateProcedure, publicProcedure } from '../trpc'
import { TRPCError } from '@trpc/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis/nodejs'
import { clerkClient } from '@clerk/nextjs'
import { Author, type Pack } from '@prisma/client'
import { filterUserForClient } from '../helpers/filterUserForClient'
import { errorHandler } from '../helpers/errorHandler'

export type AuthorWithClerkInfo = Author & { profileImageUrl: string }

const addUserDataToPack = async (packs) => {
  const userList: string[] = Array.from(
    new Set(packs.map((pack) => pack.author.map((author) => author.authorId)).flat())
  )

  const users = (
    await clerkClient.users.getUserList({
      userId: userList.map((author) => author),
      limit: 100,
    })
  ).map(filterUserForClient)

  return packs.map((pack) => {
    const author = pack.author.map((author) => {
      const authorInfo = users.find((user) => author.authorId === user.id)

      return { ...author, ...authorInfo }
    })
    return { pack, author }
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
  getLatestPacks: publicProcedure.query(async ({ ctx }) => {
    const packs = await ctx.prisma.pack.findMany({
      where: { isPublic: true },
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        author: true,
      },
    })
    return addUserDataToPack(packs)
  }),
  getPackById: publicProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    const pack = await ctx.prisma.pack.findUnique({
      where: { packId: input.id },
      include: {
        packItems: { include: { item: true } },
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
  getPacksByUser: publicProcedure
    .input(z.object({ authorId: z.string() }))
    .query(async ({ ctx, input }) => {
      // find all the packs of a single user
      const userPacks = await ctx.prisma.pack.findMany({
        where: {
          author: {
            every: { authorId: input.authorId },
          },
        },
      })

      if (!userPacks) throw new TRPCError({ code: 'NOT_FOUND' })

      return userPacks
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
          model: {
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

      return result.filter((item) => (item.itemAuthorId === ctx.userId ? true : !item.isDuplicate))
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
      // check if user is not subscribed and has created less than 5 packs
      const user = await ctx.prisma.author.findUnique({
        where: { authorId },
        include: { packs: true },
      })
      if (!user?.isSubscribed && user?.packs && user.packs.length >= 5) {
        throw new TRPCError({ code: 'PRECONDITION_FAILED', message: 'Pack creation limit' })
      } else {
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
      }
    }),

  updatePack: privateProcedure
    .input(
      z.object({
        packId: z.string(),
        isPublic: z.boolean().optional(),
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
  editPackInfo: privateProcedure
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
          name: z.string().min(1).max(200),
          brand: z.string().optional(),
          model: z.string().optional(),
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
        // check if there is an item with the same name
        const userItems = await ctx.prisma.author.findUnique({
          where: { authorId },
          include: {
            item: true,
          },
        })
        const userHasItem = userItems?.item.find((item) => item.name === input.packItem.name)

        await ctx.prisma.pack.update({
          where: { packId: input.packId },
          data: {
            packItems: {
              create: [
                {
                  location: input.packItem.location,
                  category: input.packItem.category,
                  quantity: input.packItem.quantity,
                  item: {
                    connectOrCreate: {
                      where: { itemId: userHasItem?.itemId || '' },
                      create: {
                        name: input.packItem.name,
                        brand: input.packItem.brand,
                        model: input.packItem.model,
                        itemAuthorId: authorId,
                      },
                    },
                  },
                },
              ],
            },
          },
          include: {
            packItems: {
              include: {
                item: true,
              },
            },
          },
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
        name: z.string().min(1).max(200),
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
        // check if there is an item with the same name
        const userItems = await ctx.prisma.author.findUnique({
          where: { authorId },
          include: {
            item: true,
          },
        })
        const userHasItem = userItems?.item.find((item) => item.name === input.name)

        const itemAlreadyPresent = await ctx.prisma.item.findMany({
          where: { name: input.name },
        })

        await ctx.prisma.pack.update({
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
                  item: userHasItem?.itemId
                    ? {
                        connectOrCreate: {
                          where: { itemId: userHasItem?.itemId || '' },
                          create: {
                            name: input.name,
                            itemAuthorId: authorId,
                            isDuplicate: itemAlreadyPresent?.length > 0,
                          },
                        },
                      }
                    : {
                        update: {
                          where: { itemId: input.itemId || '' },
                          data: { name: input.name, itemAuthorId: authorId },
                        },
                      },
                },
              },
            },
          },
          include: {
            packItems: {
              include: {
                item: true,
              },
            },
          },
        })
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
        model: z.string().optional(),
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
            model: input.model,
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
        model: z.string().optional(),
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
        await ctx.prisma.item.update({
          where: { itemId: input.itemId },
          data: {
            name: input.name,
            model: input.model,
            brand: input.brand,
            itemUrl: input.itemUrl,
            imageUrl: input.imageUrl,
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
