import { z } from 'zod';
import { authorizedProcedure, baseProcedure, createTRPCRouter, protectedProcedure } from '../init';
import { TRPCError } from '@trpc/server';
import files from '@/files.json'

export const Project = createTRPCRouter({
  getProject: protectedProcedure
    .input(z.object({
      projectId: z.number()
    }))
    .query(async (opts) => {
      const project = await opts.ctx.db.project.findUnique({
        where: {
          id: opts.input.projectId
        }
      })

      return project
    }),

  newProject: protectedProcedure
    .mutation(async ({ ctx }) => {

      try {
        const project = await ctx.db.project.create({
          data: {
            name: 'New Project',
            description: 'New Project',
            files: JSON.stringify(files),

            authorId: ctx.session.user.id,
            status: 'DRAFT',
          }
        })

        const message = await ctx.db.message.create({
          data: {
            role: 'AI',
            message: "I've done the inital setup.",
            projectId: project.id
          }
        })

        return project.id

      } catch (error) {
        console.error("Project creation failed:", error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR'
        })
      }
    }),

  saveProjectFile: authorizedProcedure
    .input(z.object({
      projectId: z.number(),
      files: z.string()
    }))
    .mutation(async ({ input, ctx }) => {
      try {
        const project = await ctx.db.project.update({
          where: {
            id: input.projectId
          },
          data: {
            files: input.files
          }
        })

        return project

      } catch {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR'
        })
      }
    }),
  getProjects: baseProcedure
    .input(z.object({
      authorId: z.string().optional()
    }))
    .query(async ({ input, ctx }) => {
      try {
        if (input.authorId) {
          const projects = await ctx.db.project.findMany({
            where: {
              authorId: input.authorId
            }
          })

          return projects
        } else {
          const projects = await ctx.db.project.findMany()
          return projects
        }
      } catch (error) {
        console.error(error);
      }
    })
});