import {
  createTRPCRouter,
  protectedProcedure,
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
    })
});
