import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, authorizedProcedure } from '../init';
import { TRPCError } from '@trpc/server';
import { inngest } from '@/inngest/client';

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

    sendMessage: authorizedProcedure
        .input(z.object({
            projectId: z.number(),
            message: z.string()
        }))
        .mutation(async ({ input, ctx }) => {
            try {
                const project = await ctx.db.project.findUnique({
                    where: {
                        id: input.projectId
                    }
                })

                const message = await ctx.db.message.create({
                    data: {
                        projectId: input.projectId,
                        message: input.message,
                        role: 'USER'
                    }
                })

                // if (project?.status === 'DRAFT') {
                //     inngest.send({
                //         name: 'buildCode',
                //         data: {
                //             userReq: input.message,
                //             projectId: input.projectId,
                //         }
                //     })
                // } else {
                //     console.log('EditCode')
                //     inngest.send({
                //         name: 'editCode',
                //         data: {
                //             userReq: input.message,
                //             projectId: input.projectId,
                //         }
                //     })
                // }
                inngest.send({
                    name: 'buildCode',
                    data: {
                        userReq: input.message,
                        projectId: input.projectId,
                    }
                })

                await ctx.db.project.update({
                    where: {
                        id: input.projectId
                    },
                    data: {
                        status: 'PROCESSING'
                    }
                })

                return message
            } catch {
                await ctx.db.project.update({
                    where: {
                        id: input.projectId
                    },
                    data: {
                        status: 'FAILED'
                    }
                })

                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR'
                })
            }
        })
});