import { authMiddleware } from "@clerk/nextjs";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export default authMiddleware({
    publicRoutes: [
        "/",
        "/random",
        "/api/manifest.json",
        "/api/manifests/ingredients.json",
        "/api/randomize",
        "/meal/:id",
        "/api/meal/:id",
        "/meal/:id",
        "/meal/img/:path"
    ]
});

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
