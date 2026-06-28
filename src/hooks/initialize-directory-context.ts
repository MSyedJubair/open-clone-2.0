import { useContext, useEffect } from "react"
import DirectoryContext from "@/context/DirectoryContext"
import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query"

export function useInitializeDirectoryContext(projectId: number) {
    const trpc = useTRPC()

    const { data: project } = useSuspenseQuery(
        trpc.project.getProject.queryOptions({ projectId })
    )

    const context = useContext(DirectoryContext)

    useEffect(() => {
        if (!project?.files) {
            return
        }

        try {
            const parsedFiles = JSON.parse(project.files)
            context.setFiles((prevFiles) => {
                const prevSerialized = JSON.stringify(prevFiles)
                const nextSerialized = JSON.stringify(parsedFiles)
                return prevSerialized === nextSerialized ? prevFiles : parsedFiles
            })
        } catch (error) {
            console.error("Failed to parse project files:", error)
        }
    }, [project?.files, context.setFiles])

    return project
}