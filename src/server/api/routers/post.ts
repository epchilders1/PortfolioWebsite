import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

import { z } from "zod";

export const postRouter = createTRPCRouter({
    upsertBlogPost: protectedProcedure
        .input(
            z.object({
                id: z.string().optional(),
                headline: z.string(),
                heroImage: z.string(),
                markDownContent: z.string(),
                createdAt: z.date().optional(),
                hidden: z.boolean(),
                projectId: z.string().nullish(),
                readTimeMinutes: z.number().nullish(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            if (input.id) {
                return ctx.db.blogPost.update({
                    where: { id: input.id },
                    data: {
                        headline: input.headline,
                        heroImage: input.heroImage,
                        markDownContent: input.markDownContent,
                        createdAt: input.createdAt,
                        hidden: input.hidden,
                        projectId: input.projectId ?? null,
                        readTimeMinutes: input.readTimeMinutes,
                    },
                });
            }

            return ctx.db.blogPost.create({
                data: {
                    headline: input.headline,
                    heroImage: input.heroImage,
                    markDownContent: input.markDownContent,
                    createdAt: input.createdAt,
                    createdById: ctx.session.user.id,
                    hidden: input.hidden,
                    readTimeMinutes: input.readTimeMinutes,
                    projectId: input.projectId ?? null,
                },
            });
        }),

    deleteBlogPost: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            return ctx.db.blogPost.delete({
                where: { id: input.id },
            });
        }),
    getBlogPosts: protectedProcedure.query(async ({ ctx }) => {
        return ctx.db.blogPost.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                project: true,
            },
        });
    }),
    getBlogPostById: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            return ctx.db.blogPost.findUnique({
                where: { id: input.id },
                include: {
                    project: true,
                },
            });
        }),
});
