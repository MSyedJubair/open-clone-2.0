import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../init';
import { TRPCError } from '@trpc/server';

export const Message = createTRPCRouter({
    getMessages: protectedProcedure
        .input(z.object({
            projectId: z.number()
        }))
        .query(async ({ input, ctx }) => {
            try {
                const messages = await ctx.db.message.findMany({
                    where: {
                        projectId: input.projectId
                    }
                })

                return messages

            } catch {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR'
                })
            }
        }),

    sendMessage: protectedProcedure
        .input(z.object({
            projectId: z.number(),
            message: z.string()
        }))
        .mutation(async ({ input, ctx }) => {
            try {
                const message = await ctx.db.message.create({
                    data: {
                        projectId: input.projectId,
                        message: input.message,
                        role: 'USER'
                    }
                })

                return message
            } catch {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR'
                })
            }
        })
});