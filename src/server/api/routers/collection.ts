import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const collectionsRouter = createTRPCRouter({
  getCollections: protectedProcedure
    .query(async ({ ctx }) => {
      const covers = await ctx.prisma.cover.findMany({
        where: {
          userId: ctx.session.user.id
        },
      });

      return covers;
    }),
  getCommunityCovers: publicProcedure
    .query(async ({ ctx }) => {
      const covers = await ctx.prisma.cover.findMany({
        take: 50,
        orderBy: {
          createdAt: 'desc'
        }
      })
      return covers
    }),
});
