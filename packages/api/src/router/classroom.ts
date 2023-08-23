import { protectedProcedure, router } from "../trpc";
import { classroomNewSchema, classroomUpdateSchema } from "@acme/validations/classroom"
import { z } from "zod";
import { inferProcedureOutput } from "@trpc/server";
import { AppRouter } from ".";

export type ClassroomByIdResponse = inferProcedureOutput<AppRouter["classroom"]["byId"]>;


export const classroomRouter = router({
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.classroom.findMany({
      orderBy: {
        createdAt: "desc"
      }
    })
  }),
  byId: protectedProcedure.input(z.object({
    id: z.string()
  })).query(async ({ ctx, input: { id } }) => {
    return await ctx.prisma.classroom.findUnique({
      where: {
        id
      },
      include: {
        teachers: true,
        students: true
      }
    })
  }),
  create: protectedProcedure
    .input(classroomNewSchema)
    .mutation(async ({ ctx, input: data }) => {
      return await ctx.prisma.classroom.create({
        data
      })
    }),
  update: protectedProcedure
    .input(classroomUpdateSchema)
    .mutation(({ ctx, input }) => {
      const { id, ...data } = input
      const { teachers, students, ...classroomData } = data

      return ctx.prisma.classroom.update({
        where: { id },
        data: {
          ...classroomData,
          teachers: {
            deleteMany: {},
            create: teachers?.map(teacher => (
              {
                teacherId: teacher
              }
            ))
          },
          students: {
            deleteMany: {},
            create: students?.map(student => (
              {
                studentId: student
              }
            ))
          }
        }
      })
    })
})
