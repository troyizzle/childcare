import { router } from "../trpc";
import { authRouter } from "./auth";
import { classroomRouter } from "./classroom";
import { studentRouter } from "./student";
import { userRouter } from "./user";

export const appRouter = router({
  auth: authRouter,
  classroom: classroomRouter,
  student: studentRouter,
  user: userRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
