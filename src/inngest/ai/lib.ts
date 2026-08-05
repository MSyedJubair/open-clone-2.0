import prisma from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher-server";
import { FileTree } from "@/lib/types";
import { generateWithGemini } from "./gemini";
import { Project } from "@/app/generated/prisma/client";
import { notifyCompleted } from "../services/notifications";

interface AiResponse {
    name: string,
    description: string,
    files: Record<string, string>
}

export function parseAiResponse(aiText: string) {
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

export function mergeAiFiles(currentFiles: FileTree, newFiles: FileTree): FileTree {
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

export async function getProject(id: number) {
    return prisma.project.findUnique({
        where: { id }
    })
}

export async function updateProjectFiles(id: number, files: FileTree) {
    return prisma.project.update({
        where: { id },
        data: {
            files: JSON.stringify(files),
            status: "COMPLETED"
        }
    })
}

export async function consumeTokens(userId: string, tokens: number) {
    if (!tokens) return;

    return prisma.user.update({
        where: { id: userId },
        data: {
            token: {
                decrement: tokens
            }
        }
    })
}

type ProcessOptions =  {
    project: Project,
    prompt: string,
    systemInstruction: string,
    message: string
}
export async function processAiResult({
    project,
    prompt,
    systemInstruction,
    message,
}: ProcessOptions) {

    const ai = await generateWithGemini(
        prompt,
        systemInstruction
    );

    await consumeTokens(project.authorId, ai.tokens);

    const parsed = parseAiResponse(ai.text);

    const merged = mergeAiFiles(
        JSON.parse(project.files),
        parsed.files
    );

    await prisma.project.update({
        where:{id:project.id},
        data:{
            name:parsed.name,
            description:parsed.description,
            files:JSON.stringify(merged),
            status:"COMPLETED"
        }
    });

    await prisma.message.create({
        data:{
            projectId:project.id,
            role:"AI",
            message
        }
    });

    await notifyCompleted(project.id);
}