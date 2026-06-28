'use client'

import { FolderTree } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import File from "./File"
import Folder from "./Folder"
import { useContext, useMemo, useState } from "react"
import DirectoryContext from "@/context/DirectoryContext"
import { convertToWebContainerFormat } from "@/lib/utils"
import CollapseAllButton from "./CollapseAllButton"
import CreateFileDialog from "./CreateFileDialog"
import CreateFolderDialog from "./CreateFolderDialog"

const Directory = () => {
  const context = useContext(DirectoryContext)
  const files = convertToWebContainerFormat(context.files)
  const [expandedFolders, setExpandedFolders] = useState<string[]>([])

  const sortedEntries = useMemo(() => Object.entries(files).sort(([nameA, dataA], [nameB, dataB]) => {
    const isFolderA = dataA && 'directory' in dataA
    const isFolderB = dataB && 'directory' in dataB

    if (isFolderA && !isFolderB) return -1
    if (!isFolderA && isFolderB) return 1

    return nameA.localeCompare(nameB, undefined, { numeric: true, sensitivity: 'base' })
  }), [files])

  const toggleFolder = (folderPath: string) => {
    setExpandedFolders((prevFolders) =>
      prevFolders.includes(folderPath)
        ? prevFolders.filter((path) => path !== folderPath)
        : [...prevFolders, folderPath]
    )
  }

  const collapseAll = () => {
    setExpandedFolders([])
  }

  return (
    <Card className="w-full max-w-xs border-border bg-card shadow-sm rounded-lg overflow-hidden h-full mb-7 flex flex-col">
      <CardHeader className="py-3 px-4 border-b border-border/60 bg-muted/10 shrink-0">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-xs font-semibold tracking-wider uppercase flex items-center gap-2 text-muted-foreground select-none">
            <FolderTree className="h-4 w-4 text-primary/80" />
            <span>Explorer</span>
          </CardTitle>

          <div className="flex flex-wrap items-center justify-center gap-1.5">
            <CreateFileDialog />
            <CreateFolderDialog />
            <CollapseAllButton onCollapseAll={collapseAll} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-2 flex-1 min-h-0">
        <ScrollArea className="h-full w-full pr-2">
          <ul className="space-y-1">
            {sortedEntries.map(([name, data]) => {
              if (data && 'directory' in data) {
                return (
                  <li key={name}>
                    <Folder
                      name={name}
                      data={data}
                      level={1}
                      path={name}
                      isExpanded={expandedFolders.includes(name)}
                      expandedFolderPaths={expandedFolders}
                      onToggle={toggleFolder}
                    />
                  </li>
                )
              }

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