import ProjectHeader from "@/components/Shared/ProjectHeader";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import ProjectView from "@/features/ProjectView/ProjectView";

const project = async ({ params }: { params: Promise<{ projectId: string }> }) => {
    const { projectId } = await params

    prefetch(trpc.project.getProject.queryOptions({ projectId: Number(projectId) }))
    prefetch(trpc.message.getMessages.queryOptions({ projectId: Number(projectId) }))

    return (
        <>
            <HydrateClient>
                <ProjectHeader projectId={Number(projectId)} />
                <ProjectView projectId={Number(projectId)}/>
            </HydrateClient>
        </>
    )
}

export default project