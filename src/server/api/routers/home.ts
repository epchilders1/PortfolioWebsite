import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const homeRouter = createTRPCRouter({
  getAllInfo: publicProcedure.query(async ({ ctx }) => {
    const [projects, blogPosts] = await Promise.all([
      ctx.db.project.findMany({
        orderBy: { precedence: "desc" },
      }),
      ctx.db.blogPost.findMany({
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return {
      projects,
      blogPosts,
    };
  }),
});
