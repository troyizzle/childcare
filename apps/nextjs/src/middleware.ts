// import { withClerkMiddleware } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
//
// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// export default withClerkMiddleware((_req: NextRequest) => {
//   return NextResponse.next();
// });
//
// // Stop Middleware running on static files
// export const config = {
//   matcher: [
//     /*
//      * Match request paths except for the ones starting with:
//      * - _next
//      * - static (static files)
//      * - favicon.ico (favicon file)
//      *
//      * This includes images, and requests from TRPC.
//      */
//     "/(.*?trpc.*?|(?!static|.*\\..*|_next|favicon.ico).*)",
//   ],
// };

import { authMiddleware, redirectToSignIn } from "@clerk/nextjs/server";

export default authMiddleware({
  afterAuth(auth, req) {
    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }
  },

  publicRoutes: ["/"]
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
