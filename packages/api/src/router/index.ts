import { router } from "../trpc";
import { actionRouter } from "./action";
import { authRouter } from "./auth";
import { classroomRouter } from "./classroom";
import { roleRouter } from "./role";
import { studentRouter } from "./student";
import { userRouter } from "./user";

export const appRouter = router({
  auth: authRouter,
  action: actionRouter,
  classroom: classroomRouter,
  role: roleRouter,
  student: studentRouter,
  user: userRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
