import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { clerkClient } from "@clerk/nextjs"

export const userRouter = router({
  all: protectedProcedure.query(async ({ ctx }) => {
    const users = await clerkClient.users.getUserList()
    const userIds = users.map(({ id }) => id)

    const userRoles = await ctx.prisma.userRole.findMany({
      where: { userId: { in: userIds } },
      include: { role: true }
    })

    return users.map(user => {
      const roles = userRoles.filter(({ userId }) => userId === user.id).map(({ role }) => role)

      return {
        ...user,
        roles
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
    })
})
