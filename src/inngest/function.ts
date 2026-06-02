// src/inngest/functions.ts

import { GoogleGenerativeAI } from "@google/generative-ai";
import { inngest } from "./client";
import prisma from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher-server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const CodeBuildSystemPrompt = `
    You are an expert React developer. 
    Generate a project structure for webcontainer using Tailwind CSS. 
    Make sure the design is modern and the code is responsive across all devices.

    IMPORTANT: Return ONLY a valid JSON object. 
    Do not include explanations or markdown outside the JSON block.

    Return ONLY a JSON object with:
    1. "name": A meaningfull, 2-3 words project name
    2. "description": A descriptive summary of the project
    3. "files": an object.

    Rules:
    - Only use React
    - Only use Tailwind
    
    Structure:
    {
    "name": "string",
    "description": "string",
    "files": {
        "App.jsx": {
            file: {
            contents: "source code string",
            },
        },
        components: {
            directory: {
            "header.jsx": {
                file: {
                contents: "source code string",
                },
            },
            },
        },
        "package.json": {
            file: {
            contents: "add dependencies and versions",
            },
        },
    }

    Note: Ensure all code strings are properly escaped for JSON. Use double quotes for JSON keys/values and escape internal quotes in the code.
`;


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

