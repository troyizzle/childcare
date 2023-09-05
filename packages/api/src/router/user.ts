import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { clerkClient, isClerkAPIResponseError } from "@clerk/nextjs"
import { inferProcedureOutput, TRPCError } from "@trpc/server";
import { AppRouter } from ".";
import { userUpdateSchema } from "@acme/validations/user"

export type UserByIdResponse = inferProcedureOutput<AppRouter["user"]["byId"]>;
export type UserAllResponse = inferProcedureOutput<AppRouter["user"]["all"]>;

export const userRouter = router({
  all: protectedProcedure.query(async ({ ctx }) => {
    const users = await clerkClient.users.getUserList()
    const userIds = users.map(({ id }) => id)

    const children = await ctx.prisma.studentParent.findMany({
      where: { parentId: { in: userIds } },
      include: { student: true }
    })

    const userRoles = await ctx.prisma.userRole.findMany({
      where: { userId: { in: userIds } },
      include: { role: true }
    })

    return users.map(user => {
      const roles = userRoles.filter(({ userId }) => userId === user.id).map(({ role }) => role)
      const childrenForUser = children.filter(({ parentId }) => parentId === user.id).map(({ student }) => student)

      return {
        ...user,
        roles,
        children: childrenForUser
      }
    })
  }),
  byId: protectedProcedure.input(z.object({
    id: z.string()
  }))
    .query(async ({ ctx, input }) => {
      const { id: userId } = input;

      const roles = await ctx.prisma.userRole.findMany({
        where: { userId },
        include: { role: true }
      })

      const children = await ctx.prisma.studentParent.findMany({
        where: { parentId: userId },
        include: { student: true }
      })

      const students = await ctx.prisma.student.findMany({
        where: {
          classrooms: {
            every: {
              classroomId: {
                in: await ctx.prisma.classroomTeachers.findMany({
                  where: { teacherId: userId },
                  select: { classroomId: true }
                }).then(classrooms => classrooms.map(({ classroomId }) => classroomId))
              }
            }
          }
        }
      })

      return {
        roles,
        children,
        students
      }
    }),
  update: protectedProcedure
    .input(userUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const { roles, children, ...clerkInput } = input
      try {
        const user = await clerkClient.users.updateUser(input.id, clerkInput)


        await ctx.prisma.$transaction(async (tx) => {
          await tx.userRole.deleteMany({
            where: { userId: user.id }
          })

          await tx.userRole.createMany({
            data: roles.map(role => ({
              userId: user.id,
              roleId: role
            }))
          })

          await tx.studentParent.deleteMany({
            where: { parentId: user.id }
          })

          await tx.studentParent.createMany({
            data: children.map(child => ({
              parentId: user.id,
              studentId: child
            }))
          })
        })

        const userRoles = await ctx.prisma.userRole.findMany({
          where: { userId: user.id },
          include: { role: true }
        })

        await clerkClient.users.updateUserMetadata(input.id, {
          publicMetadata: {
            roles: userRoles.map(({ role }) => role.name)
          }
        })

        return user
      } catch (e) {
        if (isClerkAPIResponseError(e)) {
          if (e.status === 404) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "User not found"
            })
          }
        }
      }
    })
})
