import { z } from "zod";

import {
  // createTRPCRouter,
  // privateProcedure,
  publicProcedure, router,
} from "../trpc";
// import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
// import { Redis } from "@upstash/redis";
import { TRPCError } from "@trpc/server";
import { clerkClient } from "@clerk/nextjs";
// import { filterUserForClient } from "@/server/helpers/filterUserForClient";
import { type Post } from "@prisma/client";

const addUserDataToPosts = async (posts: Post[]) => {
  const users = (
    await clerkClient.users.getUserList({
      userId: posts.map((post) => post.authorId),
      limit: 100,
    })
  )
  // .map(filterUserForClient);

  return posts.map((post) => {
    const author = users.find((user) => user.id === post.authorId);

    if (!author?.id) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Author for post not found",
      });
    }
    return {
      post,
      author,
    };
  });
};
// Create a new ratelimiter, that allows 10 requests per 10 seconds
// const ratelimit = new Ratelimit({
//   redis: Redis.fromEnv(),
//   limiter: Ratelimit.slidingWindow(10, "10 s"),
//   analytics: true,
//   prefix: "@upstash/ratelimit",
// });

export const postsRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany();
    return posts
    // return addUserDataToPosts(posts);
  }),
  // create: privateProcedure
  //   .input(
  //     z.object({
  //       content: z.string().min(1).max(200),
  //     }),
  //   )
  //   .mutation(async ({ ctx, input }) => {
  //     const authorId = ctx.userId;

  //     const { success } = await ratelimit.limit(authorId);

  //     if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

  //     const post = await ctx.prisma.post.create({
  //       data: {
  //         authorId,
  //         content: input.content,
  //       },
  //     });
  //     return post;
  //   }),
  // delete: privateProcedure
  //   .input(
  //     z.object({
  //       id: z.string(),
  //     }),
  //   )
  //   .mutation(async ({ ctx, input }) => {
  //     const authorId = ctx.userId;

  //     const { success } = await ratelimit.limit(authorId);

  //     if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
  //     try {
  //       await ctx.prisma.post.delete({
  //         where: { id: input.id, authorId: authorId },
  //       });
  //     } catch (err) {
  //       throw new TRPCError({ code: "NOT_FOUND" });
  //     }
  //     return "ok";
  //   }),
  // edit: privateProcedure
  //   .input(
  //     z.object({
  //       id: z.string(),
  //       content: z.string(),
  //     }),
  //   )
  //   .mutation(async ({ ctx, input }) => {
  //     const authorId = ctx.userId;

  //     const { success } = await ratelimit.limit(authorId);

  //     if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
  //     try {
  //       await ctx.prisma.post.update({
  //         where: { id: input.id, authorId: authorId },
  //         data: {
  //           authorId,
  //           content: input.content,
  //         },
  //       });
  //     } catch (err) {
  //       throw new TRPCError({ code: "NOT_FOUND" });
  //     }
  //     return "ok";
  //   }),
});
