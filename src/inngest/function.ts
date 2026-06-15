// src/inngest/functions.ts

import { GoogleGenerativeAI } from "@google/generative-ai";
import { inngest } from "./client";
import prisma from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher-server";
import { FileSystemTree, TreeNode } from "@/lib/types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const CodeBuildSystemPrompt = process.env.CODE_BUILD_SYSTEM_PROMPT as string

const EditCodeSystemPrompt = process.env.CODE_EDIT_SYSTEM_PROMPT as string

function mergeNode(
  target: TreeNode,
  source: TreeNode
): TreeNode {
  // File replacement
  if (source.file) {
    return {
      file: source.file,
    };
  }

  // Directory merge
  if (source.directory) {
    const mergedDirectory = {
      ...(target.directory ?? {}),
    };

    for (const key in source.directory) {
      mergedDirectory[key] = mergeNode(
        mergedDirectory[key] ?? {},
        source.directory[key]
      );
    }

    return {
      directory: mergedDirectory,
    };
  }

  return target;
}

export function deepMerge(
  target: FileSystemTree,
  source: FileSystemTree
): FileSystemTree {
  const merged: FileSystemTree = {
    ...target,
  };

  for (const key in source) {
    merged[key] = mergeNode(
      merged[key] ?? {},
      source[key]
    );
  }

  return merged;
}

type ProjectFiles = {
  [key: string]: string;
};

function toWebContainerStructure(flatFiles) {
  const root = {};

  for (const [filePath, content] of Object.entries(flatFiles)) {
    // Split the path into individual directory/file segments
    const parts = filePath.split('/');
    let currentDir = root;

    parts.forEach((part, index) => {
      const isLast = index === parts.length - 1;

      if (isLast) {
        // If it's the last segment, it's a file
        currentDir[part] = {
          file: {
            contents: content
          }
        };
      } else {
        // If it's not the last segment, it's a directory
        if (!currentDir[part]) {
          currentDir[part] = {
            directory: {}
          };
        }
        // Move deeper into the tree
        currentDir = currentDir[part].directory;
      }
    });
  }

  return root;
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

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: userReq }] }],
        generationConfig: { responseMimeType: "application/json" },
      });

      return JSON.parse(result.response.text())
    })

    await step.run("update-db-project", async () => {
      const files = toWebContainerStructure(response.files)

      return await prisma.project.update({
        where: { id: Number(projectId) },
        data: {
          name: response.name,
          description: response.description,
          files: JSON.stringify(files),
          status: 'COMPLETED',
        },
      });
    });

    await step.run("create-chat-message", async () => {
      await prisma.message.create({
        data: {
          message: "Created " + response.description,
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
        generationConfig: {
          responseMimeType: "application/json",
        },
      });

      return JSON.parse(result.response.text())
    })

    const mergedFiles = deepMerge(
      structuredClone(existingFiles),
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
