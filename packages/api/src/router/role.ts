import { protectedProcedure, router } from "../trpc";

export const roleRouter = router({
  all: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.role.findMany()
  })
})
