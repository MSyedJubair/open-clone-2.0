import ProjectHeader from "@/components/Shared/ProjectHeader";
import { caller, HydrateClient, prefetch, trpc } from "@/trpc/server";
import ProjectView from "@/features/ProjectView/ProjectView";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const project = async ({ params }: { params: Promise<{ projectId: string }> }) => {
    const { projectId } = await params

    prefetch(trpc.project.getProject.queryOptions({ projectId: Number(projectId) }))
    prefetch(trpc.message.getMessages.queryOptions({ projectId: Number(projectId) }))

    const session = await auth.api.getSession({
        headers: await headers()
    })

    const project = await caller.project.getProject({ projectId: Number(projectId) })
    const isAuthorized = project?.authorId === session?.user.id

    return (
        <>
            <HydrateClient>
            <ProjectHeader projectId={Number(projectId)} isAuthorized={isAuthorized} />
                <ProjectView projectId={Number(projectId)} />
            </HydrateClient>
        </>
    )
}

export default project