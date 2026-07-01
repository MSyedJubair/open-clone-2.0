// src/inngest/functions.ts

import { GoogleGenerativeAI } from "@google/generative-ai";
import { inngest } from "./client";
import prisma from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher-server";
import { FileTree } from "@/lib/types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const CodeBuildSystemPrompt = `
You are a Senior React Router Developer. Your task is to build a website based on the user instruction. The project is pre-configured with all shadcnUI components, Tailwind CSS v4, GSAP, and Motion. You just have to return the updated pages.

CRITICAL: Do NOT output JSON. You must use the following XML-like tagging structure to output your response. 

Provide the project metadata in a <project> tag, and wrap every file inside a <file> tag with a "path" attribute. 

Output format:
<project name="Your Project Name" description="A short description of the project">
  <file path="app/routes/home.tsx">
    import { useState } from 'react';
    // ... raw, unescaped code goes here
  </file>
  <file path="components/ui/custom-button.tsx">
    // ... raw, unescaped code goes here
  </file>
</project>
`

const EditCodeSystemPrompt = process.env.CODE_EDIT_SYSTEM_PROMPT as string

interface AiResponse {
  name: string,
  description: string,
  files: Record<string, string>
}

function parseAiResponse(aiText: string) {
  const projectRegex = /<project\s+name="([^"]+)"\s+description="([^"]+)">/i;
  const projectMatch = aiText.match(projectRegex);

  const result: AiResponse = {
    name: projectMatch ? projectMatch[1] : 'Untitled',
    description: projectMatch ? projectMatch[2] : '',
    files: {}
  };

  const fileRegex = /<file\s+path="([^"]+)">([\s\S]*?)<\/file>/gi;
  let match;

  while ((match = fileRegex.exec(aiText)) !== null) {
    const filePath = match[1];
    const fileContent = match[2].trim();
    result.files[filePath] = fileContent;
  }

  return result;
}

function mergeAiFiles(currentFiles: FileTree, newFiles: FileTree): FileTree {
  // 1. Create a shallow copy to maintain immutability (best practice for React/State)
  const mergedFiles = { ...currentFiles };

  // 2. Iterate through the newly generated files
  for (const [filePath, fileContent] of Object.entries(newFiles)) {
    const trimmedContent = fileContent.trim();

    // 3. Handle Deletions: Allow the AI to delete a file by returning an empty string
    if (trimmedContent === "") {
      delete mergedFiles[filePath];
    } else {
      // 4. Handle Additions & Updates: Overwrite existing or create new
      mergedFiles[filePath] = fileContent;
    }
  }

  return mergedFiles;
}

export const buildCode = inngest.createFunction(
  {
    id: "buildCode",
    triggers: { event: "buildCode" },
    retries: 1,
    onFailure: async ({ event, error }) => {
      const originalEvent = event.data.event;
      const projectId = originalEvent.data.projectId;

      console.log(projectId);

      await pusherServer.trigger(
        String(projectId),
        "build-status",
        {
          status: "failed",
          message: error.message,
          timestamp: Date.now(),
        }
      );

      await prisma.project.update({
        where: {
          id: projectId
        },
        data: {
          status: 'FAILED'
        }
      })
    }
  },
  async ({ event, step }) => {
    const { userReq, projectId } = event.data;

    await pusherServer.trigger(projectId.toString(), 'build-status', {
      text: 'Generation started.',
      status: 'generating',
      timestamp: Date.now(),
    })

    const response = await step.run('generating response', async () => {
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        systemInstruction: CodeBuildSystemPrompt,
      });

      const response = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: userReq }] }]
      });

      return response.response.text()
    })

    const result = await step.run('parsing response', async () => {
      if (!response) {
        console.log("No response candidates returned");
        return;
      }

      return parseAiResponse(response)
    })

    const mergedResult = await step.run('merge response', async () => {
      if (!result) {
        return
      }

      const project = await prisma.project.findFirst({
        where: {
          id: Number(projectId)
        }
      })

      const currentFiles = JSON.parse(project?.files || '')

      const mergedFiles = mergeAiFiles(currentFiles, result.files)

      return mergedFiles
    })

    await step.run("update-db-project", async () => {
      if (!result) return

      return await prisma.project.update({
        where: { id: Number(projectId) },
        data: {
          name: result.name,
          description: result.description,
          files: JSON.stringify(mergedResult),
          status: 'COMPLETED',
        },
      });
    });

    await step.run("create-chat-message", async () => {
      if (!result) {
        return
      }

      await prisma.message.create({
        data: {
          message: "Created " + result.description,
          role: "AI",
          projectId: projectId
        },
      });
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

      console.log(projectId);

      await pusherServer.trigger(
        String(projectId),
        "build-status",
        {
          status: "failed",
          message: error.message,
          timestamp: Date.now(),
        }
      );

      await prisma.project.update({
        where: {
          id: projectId
        },
        data: {
          status: 'FAILED'
        }
      })
    }
  },

  async ({ event, step }) => {
    const { userReq, projectId } = event.data;

    await pusherServer.trigger(projectId.toString(), 'build-status', {
      text: 'Generation started.',
      status: 'generating',
      timestamp: Date.now(),
    })

    const project = await step.run(
      "get-project",
      async () => {
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

    const response = await step.run('generating response', async () => {
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        systemInstruction: EditCodeSystemPrompt,
      });

      const result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `
                    Current Project:
                    ${JSON.stringify(existingFiles)}

                    User Request:
                    ${userReq}
                `,
              },
            ],
          },
        ],
      });

      return JSON.parse(result.response.text())
    })

    const mergedFiles = mergeAiFiles(
      existingFiles,
      response.updatedFiles
    );

    await prisma.project.update({
      where: {
        id: Number(projectId),
      },
      data: {
        files: JSON.stringify(mergedFiles),
        status: 'COMPLETED'
      },
    });

    await prisma.message.create({
      data: {
        message: response.summary,
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
  }
)
