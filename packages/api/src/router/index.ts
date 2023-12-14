import { createTRPCRouter } from '../trpc'
import { postsRouter } from './posts'
import { packsRouter } from './packs'
// import { createTRPCRouter } from "@/server/api/trpc";
// import { s3Router } from "./routers/s3";

export const appRouter = createTRPCRouter({
  posts: postsRouter,
  packs: packsRouter,
  // s3: s3Router
})

// export type definition of API
export type AppRouter = typeof appRouter
