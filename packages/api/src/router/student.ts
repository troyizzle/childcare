import { protectedProcedure, router } from "../trpc";
import { studentNewSchema, studentProfilePictureSchema, studentUpdateSchema } from "@acme/validations/student";
import { inferProcedureOutput, TRPCError } from "@trpc/server";
import { z } from "zod";
import { clerkClient } from "@clerk/nextjs";
import { studentActionLogNewSchema } from "@acme/validations/student-action-log";
import { AppRouter } from ".";
import { endOfDay, parseISO, startOfDay } from "date-fns";

export type StudentByIdResponse = inferProcedureOutput<AppRouter["student"]["byId"]>
export type StudentLogsByStudentIdResponse = inferProcedureOutput<AppRouter["student"]["logsByStudentId"]>

export const studentRouter = router({
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.student.findMany()
  }),
  byId: protectedProcedure.input(z.object({
    id: z.string()
  })).query(async ({ ctx, input: { id } }) => {
    return await ctx.prisma.student.findUnique({
      where: {
        id
      },
      include: {
        contactInfos: true
      }
    })
  }),
  create: protectedProcedure
    .input(studentNewSchema)
    .mutation(async ({ ctx, input: data }) => {
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
    }),
  update: protectedProcedure
    .input(studentUpdateSchema)
    .mutation(async ({ ctx, input: data }) => {
      const { id, contactInfos, ...rest } = data

      try {
        return await ctx.prisma.student.update({
          where: { id },
          data: {
            ...rest,
            contactInfos: {
              deleteMany: {},
              createMany: {
                data: contactInfos
              }
            }
          }
        })
      } catch (e) {
        console.log(e)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "There was an error updating the student, try again later"
        })
      }
    }),
  logsByStudentId: protectedProcedure.input(
    z.object({ studentId: z.string(), date: z.date() })
  ).query(async ({ ctx, input: { studentId, date } }) => {
    const parsedDate = parseISO(date.toISOString())
    const startDate = startOfDay(parsedDate)
    const endDate = endOfDay(parsedDate)

    const logs = await ctx.prisma.studentActionLog.findMany({
      where: {
        studentId,
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        action: true
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    const teacherIds = logs?.map(({ teacherId }) => teacherId)

    const users = await clerkClient.users.getUserList({
      userId: teacherIds
    })

    return logs.map(log => ({
      ...log,
      teacher: users.find(({ id }) => id === log.teacherId)
    }))
  }),
  createLog: protectedProcedure
    .input(studentActionLogNewSchema)
    .mutation(async ({ ctx, input: data }) => {
      try {
        return await ctx.prisma.studentActionLog.create({
          data: {
            ...data,
            teacherId: ctx.auth.userId,
            postedAt: new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000),
          }
        })
      } catch (e) {
        console.log(e)

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "There was an error creating the student action log, try again later"
        })
      }
    }),
  profilePicture: protectedProcedure
    .input(studentProfilePictureSchema)
    .mutation(async ({ ctx, input: data }) => {
      const { id, ...rest } = data

      return ctx.prisma.student.update({
        where: { id },
        data: {
          ...rest
        }
      })
    })
})
