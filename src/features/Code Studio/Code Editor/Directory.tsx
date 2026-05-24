'use client'

import { FolderTree } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import File from "./File"
import Folder from "./Folder"
import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query"

interface FileData {
  contents: string
}

interface TreeNode {
  directory?: { [nodeName: string]: TreeNode }
  file?: FileData
}

const Directory = ({ projectId }: { projectId: number }) => {
  const trpc = useTRPC()
  const { data: project } = useSuspenseQuery(
    trpc.project.getProject.queryOptions({ projectId: projectId })
  )
  
  const files: Record<string, TreeNode> = project?.files 
    ? JSON.parse(project.files) 
    : {}

  return (
    <Card className="w-full max-w-xs border-border bg-card shadow-sm rounded-lg overflow-hidden h-full">
      <CardHeader className="py-3 px-4 border-b border-border/60 bg-muted/10">
        <CardTitle className="text-xs font-semibold tracking-wider uppercase flex items-center gap-2 text-muted-foreground select-none">
          <FolderTree className="h-4 w-4 text-primary/80" />
          <span>Explorer</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <ScrollArea className="h-[450px] w-full pr-2">
          <ul className="space-y-0.5 token-tree-root">
            {Object.entries(files).map(([name, data]) => {
              if (data && 'directory' in data) {
                return (
                  <li key={name}>
                    <Folder name={name} data={data} level={1} path={name} />
                  </li>
                )
              }
              return null
            })}
            {Object.entries(files).map(([name, data]) => {
              if (data && 'file' in data && data.file) {
                return (
                  <li key={name}>
                    <File name={name} data={data.file.contents} level={1} path={name} />
                  </li>
                )
              }
              return null
            })}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

export default Directory