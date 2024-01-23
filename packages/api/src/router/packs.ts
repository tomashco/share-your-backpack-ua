import { z } from 'zod'

import { createTRPCRouter, privateProcedure, publicProcedure } from '../trpc'
import { TRPCError } from '@trpc/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis/nodejs'
import { clerkClient } from '@clerk/nextjs'
import { type Pack } from '@prisma/client'
import { filterUserForClient } from '../helpers/filterUserForClient'

const addUserDataToPack = async (authors) => {
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
    // return packs
    return addUserDataToPack(packs)
  }),
  getById: publicProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    const pack = await ctx.prisma.pack.findUnique({
      where: { id: input.id },
      include: {
        packItems: true,
        author: true,
      },
    })
    if (!pack) throw new TRPCError({ code: 'NOT_FOUND' })

    return pack
  }),
  getItems: privateProcedure.query(async ({ ctx }) => {
    // find all the unique packItems among all the packs of a single user
    const authorId = ctx.userId
    const userPacks = await ctx.prisma.author.findMany({
      where: { authorId: authorId },
      include: {
        packs: true,
      },
    })
    if (!userPacks) throw new TRPCError({ code: 'NOT_FOUND' })

    const packItems = {}
    userPacks.forEach((user) =>
      user.packs.forEach((item) => {
        if (!packItems.hasOwnProperty(item.id)) {
          packItems[item.id] = item
        }
      })
    )

    return Object.values(packItems)
  }),

  search: publicProcedure.input(z.object({ value: z.string() })).query(async ({ ctx, input }) => {
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

  createPack: privateProcedure
    .input(
      z.object({
        name: z.string().min(1).max(200),
        description: z.string().optional(),
        packItems: z
          .object({
            name: z.string().min(1).max(200),
          })
          .array()
          .optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId
      let pack = {}

      // const author =

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
    }),

  editPack: privateProcedure
    .input(
      z.object({
        id: z.string(),
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
          where: { id: input.id },
          data: { ...input },
        })
      } catch (err) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }
      return 'ok'
    }),

  deletePack: privateProcedure
    .input(
      z.object({
        id: z.string(),
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
              id: input.id,
            },
            data: {
              packItems: {
                deleteMany: {},
              },
            },
            include: {
              packItems: true,
            },
          }),
          ctx.prisma.pack.delete({
            where: { id: input.id },
          }),
        ])
      } catch (err) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }
      return 'ok'
    }),
  addPackItems: privateProcedure
    .input(
      z.object({
        id: z.string(),
        packItems: z
          .object({
            name: z.string().min(1).max(200),
            category: z.string().optional(),
            location: z.string().optional(),
          })
          .array(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId

      const { success } = await ratelimit.limit(authorId)

      if (!success) throw new TRPCError({ code: 'TOO_MANY_REQUESTS' })
      try {
        await ctx.prisma.pack.update({
          where: { id: input.id },
          data: {
            packItems: {
              create: input.packItems,
            },
          },
          include: {
            packItems: true,
          },
        })
      } catch (err) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }
      return 'ok'
    }),

  editPackItem: privateProcedure
    .input(
      z.object({
        packId: z.string(),
        id: z.string(),
        name: z.string().min(1).max(200),
        category: z.string().optional(),
        location: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId

      const { success } = await ratelimit.limit(authorId)

      if (!success) throw new TRPCError({ code: 'TOO_MANY_REQUESTS' })
      try {
        await ctx.prisma.pack.update({
          where: { id: input.packId },
          data: {
            packItems: {
              update: {
                where: {
                  id: input.id,
                },
                data: {
                  // name: input.name,
                  category: input.category,
                  location: input.location,
                },
              },
            },
          },
          include: {
            packItems: true,
          },
        })
      } catch (err) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }
      return 'ok'
    }),
  deletePackItem: privateProcedure
    .input(
      z.object({
        packId: z.string(),
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId

      const { success } = await ratelimit.limit(authorId)

      if (!success) throw new TRPCError({ code: 'TOO_MANY_REQUESTS' })
      try {
        await ctx.prisma.pack.update({
          where: { id: input.packId },
          data: {
            packItems: {
              delete: {
                id: input.id,
              },
            },
          },
          include: {
            packItems: true,
          },
        })
      } catch (err) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }
      return 'ok'
    }),
})
