import { useContext, useEffect } from "react"
import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query"
import ProjectContext from "@/context/ProjectContext"

export function useInitializeProjectContext(projectId: number) {
    const trpc = useTRPC()

    const { data: project, isLoading: isProjectLoading } = useSuspenseQuery(
        trpc.project.getProject.queryOptions({ projectId: projectId })
    )
    const projectContext = useContext(ProjectContext)

    useEffect(() => {
        projectContext.setStatus(project?.status || 'DRAFT')
    }, [project?.status])
}