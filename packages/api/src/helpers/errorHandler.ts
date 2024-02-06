import { Prisma } from '@my/db/index'
import { TRPCError } from '@trpc/server'

export const errorHandler = (err) => {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2014') {
      throw new TRPCError({ code: 'CONFLICT', message: err.message })
    }
    throw new TRPCError({ code: 'BAD_REQUEST', message: err.message })
  }
  throw new TRPCError({ code: 'NOT_FOUND', message: JSON.stringify(err) })
}
