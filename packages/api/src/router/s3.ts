import { z } from 'zod'

import { createTRPCRouter, publicProcedure } from '../trpc'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export const s3Router = createTRPCRouter({
  getObjects: publicProcedure
    .input(z.object({ packId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { s3 } = ctx
      const { packId } = input

      const listObjectsOutput = await s3.listObjectsV2({
        Bucket: process.env.BUCKET_NAME,
        Prefix: packId,
      })

      return listObjectsOutput.Contents ?? []
    }),

  getStandardUploadPresignedUrl: publicProcedure
    .input(z.object({ key: z.string(), packId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { key, packId } = input
      const { s3 } = ctx

      const putObjectCommand = new PutObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: `${packId}/${key}`,
      })

      return await getSignedUrl(s3, putObjectCommand)
    }),
})
