'use client'

import { FolderTree } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import File from "./File"
import Folder from "./Folder"
import { useContext } from "react"
import DirectoryContext from "@/context/DirectoryContext"


const Directory = () => {
  const context = useContext(DirectoryContext)
  const sortedEntries = Object.entries(context.files).sort(([nameA, dataA], [nameB, dataB]) => {
    const isFolderA = dataA && 'directory' in dataA
    const isFolderB = dataB && 'directory' in dataB

    // Condition 1: Folders first
    if (isFolderA && !isFolderB) return -1
    if (!isFolderA && isFolderB) return 1

    // Condition 2: Alphabetical sorting if they are the same type
    return nameA.localeCompare(nameB, undefined, { numeric: true, sensitivity: 'base' })
  })

  return (
    <Card className="w-full max-w-xs border-border bg-card shadow-sm rounded-lg overflow-hidden h-full mb-7">
      <CardHeader className="py-3 px-4 border-b border-border/60 bg-muted/10">
        <CardTitle className="text-xs font-semibold tracking-wider uppercase flex items-center gap-2 text-muted-foreground select-none">
          <FolderTree className="h-4 w-4 text-primary/80" />
          <span>Explorer</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <ScrollArea className="h-112.5 w-full pr-2">
          {sortedEntries.map(([name, data]) => {
            if (data && 'directory' in data) {
              return (
                <li key={name}>
                  <Folder name={name} data={data} level={1} path={name} />
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
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

export default Directory