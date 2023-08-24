import { protectedProcedure, router } from "../trpc";
import { actionNewSchema } from "@acme/validations/action";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export const actionRouter = router({
  all: protectedProcedure.query((({ ctx }) => {
    return ctx.prisma.action.findMany()
  })),
  create: protectedProcedure
    .input(actionNewSchema)
    .mutation((async ({ ctx, input: data }) => {
      try {
        return await ctx.prisma.action.create({
          data
        })
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === "P2002") {
            throw new TRPCError({
              code: "CONFLICT",
              message: "Action already exists"
            })
          }
        }

        console.error(e)

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong"
        })
      }
    }))
})
