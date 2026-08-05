// src/inngest/functions.ts

import { GoogleGenerativeAI } from "@google/generative-ai";
import { inngest } from "./client";
import prisma from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher-server";
import { CodeBuildSystemPrompt, EditCodeSystemPrompt } from "./prompt";
import { parseAiResponse, mergeAiFiles } from "./ai/lib";
import { notifyFailed } from "./services/notifications";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

async function onFailure(projectId: number) {
  notifyFailed(projectId)

  await prisma.project.update({
    where: {
      id: projectId
    },
    data: {
      status: 'FAILED'
    }
  })
}

export const buildCode = inngest.createFunction(
  {
    id: "buildCode",
    triggers: { event: "buildCode" },
    rateLimit: {
      limit: 2,
      period: "1m",
    },
    retries: 1,
    onFailure: async ({ event, error }) => {
      const originalEvent = event.data.event;
      const projectId = originalEvent.data.projectId;

      onFailure(projectId)
    }
  },
  async ({ event, step }) => {
    const { userReq, projectId } = event.data;

    const response = await step.run('generating response', async () => {
      await pusherServer.trigger(projectId.toString(), 'build-status', {
        text: 'Creating the project. You can close you browser.',
        status: 'generating',
        timestamp: Date.now(),
      })

      const model = genAI.getGenerativeModel({
        model: "gemini-3.1-flash-lite",
        systemInstruction: CodeBuildSystemPrompt,
      });

      const response = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: userReq }] }]
      });

      const resTokenCount = response.response.usageMetadata?.totalTokenCount

      const project = await prisma.project.findFirst({
        where: {
          id: projectId
        }
      })

      await prisma.user.update({
        where: {
          id: project?.authorId
        },
        data: {
          token: {
            decrement: resTokenCount
          }
        }
      })

      return response.response.text()
    })

    const result = await step.run('parsing response', async () => {
      if (!response) throw new Error()

      return parseAiResponse(response)
    })

    const mergedResult = await step.run('merge response', async () => {
      if (!result) throw new Error()

      const project = await prisma.project.findFirst({
        where: {
          id: Number(projectId)
        }
      })

      const currentFiles = JSON.parse(project?.files || '{}')

      const mergedFiles = mergeAiFiles(currentFiles, result.files)

      return mergedFiles
    })

    await step.run("update-db-project", async () => {
      if (!result) throw new Error()

      const project = await prisma.project.update({
        where: { id: Number(projectId) },
        data: {
          name: result.name,
          description: result.description,
          files: JSON.stringify(mergedResult),
          status: 'COMPLETED',
        },
      });

      return project
    });

    await step.run("create-chat-message", async () => {
      if (!result) throw new Error()

      await prisma.message.create({
        data: {
          message: "Created " + result.description,
          role: "AI",
          projectId: projectId
        },
      });

      await pusherServer.trigger(
        projectId.toString(),
        "build-status",
        {
          status: "completed",
          message: "Project saved successfully.",
          timestamp: Date.now(),
        }
      )
    });
  }
)

export const editCode = inngest.createFunction(
  {
    id: "editCode",
    triggers: { event: "editCode" },
    retries: 1,
    onFailure: async ({ event, error }) => {

      const originalEvent = event.data.event;
      const projectId = originalEvent.data.projectId;

      onFailure(projectId)
    }
  },

  async ({ event, step }) => {
    const { userReq, projectId } = event.data;

    const project = await step.run(
      "get-project",
      async () => {

        await pusherServer.trigger(projectId.toString(), 'build-status', {
          text: 'Creating the project. You can close you browser',
          status: 'generating',
          timestamp: Date.now(),
        })


        return prisma.project.findUnique({
          where: {
            id: Number(projectId),
          },
        });
      }
    );

    if (!project) {
      throw new Error("Project not found");
    }

    const existingFiles = JSON.parse(project.files as string);

    const routeDir = Object.entries(existingFiles).filter(([path]) => {
      const parts = path.split("/");
      return parts[0] === "app" && parts[parts.length - 1].startsWith("route.");
    });

    const response = await step.run('generating response', async () => {
      const model = genAI.getGenerativeModel({
        model: "gemini-3.1-flash-lite",
        systemInstruction: EditCodeSystemPrompt,
      });

      const result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `
                    Current 'app/route' files:
                    ${JSON.stringify(routeDir)}

                    User Request:
                    ${userReq}
                `,
              },
            ],
          },
        ],
      });

      const resTokenCount = result.response.usageMetadata?.totalTokenCount

      await prisma.user.update({
        where: {
          id: project.authorId
        },
        data: {
          token: {
            decrement: resTokenCount
          }
        }
      })

      return result.response.text()
    })

    const result = await step.run('parsing response', async () => {
      if (!response) throw new Error()

      return parseAiResponse(response)
    })

    const mergedResult = await step.run('merge response', async () => {
      if (!result) throw new Error()

      const project = await prisma.project.findFirst({
        where: {
          id: Number(projectId)
        }
      })

      const currentFiles = JSON.parse(project?.files || '{}')

      const mergedFiles = mergeAiFiles(currentFiles, result.files)

      return mergedFiles
    })

    await step.run('updating-db', async () => {
      await prisma.project.update({
        where: {
          id: Number(projectId),
        },
        data: {
          files: JSON.stringify(mergedResult),
          status: 'COMPLETED'
        },
      });

      await prisma.message.create({
        data: {
          message: result?.description || '',
          role: "AI",
          projectId,
        },
      });

      await pusherServer.trigger(
        projectId.toString(),
        "build-status",
        {
          status: "completed",
          message: "Project saved successfully.",
          timestamp: Date.now(),
        }
      )
    })
  }
)
