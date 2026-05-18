import ProjectView from "@/features/ProjectView/ProjectView"

const project = async ({ params }: { params: Promise<{ projectId: string }> }) => {
    const { projectId } = await params

    return (
        <>
            {/* <ProjectHeader projectId={projectId} />
            <ProjectChat projectId={projectId} /> */}
            <ProjectView projectId={projectId} />
            <div>{projectId}</div>
        </>
    )
}

export default project