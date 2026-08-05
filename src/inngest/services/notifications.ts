import { pusherServer } from "@/lib/pusher-server";

export async function notifyGenerating(projectId: number) {

    return pusherServer.trigger(
        String(projectId),
        "build-status",
        {
            status: "generating",
            text: "Creating the project...",
            timestamp: Date.now()
        }
    )
}

export async function notifyCompleted(projectId: number) {

    return pusherServer.trigger(
        String(projectId),
        "build-status",
        {
            status: "completed",
            message: "Project saved successfully.",
            timestamp: Date.now()
        }
    )
}

export async function notifyFailed(projectId: number) {
    await pusherServer.trigger(
        String(projectId),
        "build-status",
        {
            status: "failed",
            text: "Something went Wrong.",
            timestamp: Date.now(),
        }
    );
}