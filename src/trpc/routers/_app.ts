import { createTRPCRouter } from '../init';
import { Message } from './Message';
import { Project } from './Project';

export const appRouter = createTRPCRouter({
  project: Project,
  message: Message
});

// export type definition of API
export type AppRouter = typeof appRouter;