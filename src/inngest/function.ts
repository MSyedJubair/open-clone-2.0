// src/inngest/functions.ts

import { GoogleGenerativeAI } from "@google/generative-ai";
import { inngest } from "./client";
import prisma from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher-server";
import { FileSystemTree, TreeNode } from "@/lib/types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const CodeBuildSystemPrompt = `
You are an expert React developer. 
Generate a complete, working project structure for a WebContainer using React, Vite, and Tailwind CSS. 
Make sure the design is modern and responsive across all devices.

IMPORTANT: Return ONLY a valid JSON object. 
Do not include explanations, markdown formatting (like ` + "```json), or any text outside the JSON block. " + 
`
Return ONLY a JSON object with:
1. "name": A meaningful, 2-3 words project name
2. "description": A descriptive summary of the project
3. "files": A WebContainer-compatible FileSystemTree object.

Rules:
- Use React and Vite.
- Use Tailwind CSS for all styling.
- Use framer-motion for animations.
- Use lucide-react for icons.
- Ensure all JSON string values are properly escaped.

You MUST include the following files in the structure to ensure the app compiles and previews correctly:
- package.json (must include "dev": "vite" script and all dependencies)
- vite.config.js
- tailwind.config.js
- postcss.config.js
- index.html (must include a div with id="root" and script tag pointing to /src/main.jsx)
- src/index.css (must include @tailwind base, components, and utilities)
- src/main.jsx (must render App.jsx into the root element)
- src/App.jsx (the main application component)

Structure Template:
{
  "name": "string",
  "description": "string",
  "files": {
    "package.json": { "file": { "contents": "..." } },
    "vite.config.js": { "file": { "contents": "..." } },
    "tailwind.config.js": { "file": { "contents": "..." } },
    "postcss.config.js": { "file": { "contents": "..." } },
    "index.html": { "file": { "contents": "..." } },
    "src": {
      "directory": {
        "index.css": { "file": { "contents": "..." } },
        "main.jsx": { "file": { "contents": "..." } },
        "App.jsx": { "file": { "contents": "..." } },
        "components": {
          "directory": {
            "Header.jsx": { "file": { "contents": "..." } }
          }
        }
      }
    }
  }
}
`;

const EditCodeSystemPrompt = `
You are an expert React developer specializing in refactoring and updating code.

You will receive:
1. The current project file tree structure.
2. A user request detailing modifications, bug fixes, or new features.

Your task is to modify ONLY the files necessary to fulfill the request.

IMPORTANT: Return ONLY a valid JSON object. 
Do not include explanations, markdown formatting (like `+ "```json), or any text outside the JSON block. " +
`Rules for Code Editing:
- Return ONLY the files that need to be changed, added, or deleted.
- DO NOT use placeholders like "// ... rest of the code" or "/* existing code stays here */". You MUST output the entire, full content of the modified file.
- Maintain the exact technical stack: React, Vite, Tailwind CSS, framer-motion, and lucide-react.
- If the user requests a new file, create it in the appropriate directory using the correct WebContainer schema.
- Ensure all JSON string values are properly escaped.

Return JSON in this exact format:
{
  "summary": "A short, clear description of what was changed or added",
  "updatedFiles": {
    "src": {
      "directory": {
        "App.jsx": {
          "file": {
            "contents": "Full updated source code here..."
          }
        },
        "components": {
          "directory": {
            "Header.jsx": {
              "file": {
                "contents": "Full updated source code here..."
              }
            }
          }
        }
      }
    }
  }
}
`;

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
            return await prisma.project.update({
                where: { id: Number(projectId) },
                data: {
                    name: response.name,
                    description: response.description,
                    files: JSON.stringify(response.files),
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
