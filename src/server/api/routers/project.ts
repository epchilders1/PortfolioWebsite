import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const projectRouter = createTRPCRouter({
  upsertProject: protectedProcedure
    .input(
      z.object({
        id: z.string().optional(),
        name: z.string(),
        heroImage: z.string(),
        description: z.string(),
        gitHubURL: z.string().optional(),
        hostedURL: z.string().optional(),
        hidden: z.boolean(),
        tags: z.array(z.string()).optional(),
        precedence: z.number().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.id) {
        return ctx.db.project.update({
          where: { id: input.id },
          data: {
            name: input.name,
            heroImage: input.heroImage,
            description: input.description,
            gitHubURL: input.gitHubURL,
            hostedURL: input.hostedURL,
            hidden: input.hidden,
            tags: input.tags,
            precedence: input.precedence,
          },
        });
      }

      return ctx.db.project.create({
        data: {
          name: input.name,
          heroImage: input.heroImage,
          description: input.description,
          gitHubURL: input.gitHubURL,
          hostedURL: input.hostedURL,
          hidden: input.hidden,
          tags: input.tags,
          precedence: input.precedence,
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),
  getAllProjects: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.project.findMany({
      orderBy: { createdAt: "desc" },
    });
  }),

  deleteProject: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.project.delete({
        where: { id: input.id },
      });
    }),
});
