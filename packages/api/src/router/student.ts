import { protectedProcedure, router } from "../trpc";
import { studentNewSchema } from "@acme/validations/student";
import { TRPCError } from "@trpc/server";

export const studentRouter = router({
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.student.findMany()
  }),
  create: protectedProcedure
    .input(studentNewSchema)
    .mutation(async ({ ctx, input: data }) => {
      // TODO: add authorization
      // const userRoles = await ctx.prisma.userRole.findMany({
      //   where: {
      //     userId: ctx.auth.userId
      //   },
      //   select: {
      //     role: {
      //       select: {
      //         name: true
      //       }
      //     }
      //   }
      // })

      // const isAdmin = userRoles.some(({ role }) => role.name.toLowerCase() === "admin")
      //
      // if (!isAdmin) {
      //   throw new TRPCError({
      //     code: "FORBIDDEN",
      //     message: "You are not authorized to create a student"
      //   })
      // }

      try {
        return await ctx.prisma.student.create({
          data: {
            ...data,
            profilePicture: "https://picsum.photos/200"
          }
        })
      } catch (e) {
        console.log(e)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "There was an error creating the student, try again later"
        })
      }
    })
})
