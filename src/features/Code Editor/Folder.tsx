"use client"

import { ChevronDown, ChevronRight, Folder as FolderIcon, FolderOpen } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import File from "./File"
import { useContext } from "react"
import DirectoryContext from "@/context/DirectoryContext"

interface FileData {
  contents: string
}

interface TreeNode {
  directory?: { [nodeName: string]: TreeNode }
  file?: FileData
}

interface FolderProps {
  name: string
  data: TreeNode
  level: number,
  path: string
  isExpanded: boolean
  expandedFolderPaths: string[]
  onToggle: (folderPath: string) => void
}

const Folder = ({ name, data, level, path, isExpanded, expandedFolderPaths, onToggle }: FolderProps) => {
  const hasChildren = data.directory && Object.keys(data.directory).length > 0
  const sortedEntries = Object.entries(data.directory || {}).sort(([nameA, dataA], [nameB, dataB]) => {
    const isFolderA = dataA && 'directory' in dataA
    const isFolderB = dataB && 'directory' in dataB

    // Condition 1: Folders first
    if (isFolderA && !isFolderB) return -1
    if (!isFolderA && isFolderB) return 1

    // Condition 2: Alphabetical sorting if they are the same type
    return nameA.localeCompare(nameB, undefined, { numeric: true, sensitivity: 'base' })
  })

  const context = useContext(DirectoryContext)

  return (
    <Collapsible
      open={isExpanded}
      onOpenChange={(nextOpen) => {
        if (nextOpen !== isExpanded) {
          onToggle(path)
        }
      }}
      className="w-full select-none"
    >
      <CollapsibleTrigger asChild>
        <div
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          className="flex items-center gap-2 py-1.5 pr-2 rounded-md hover:bg-muted/70 text-sm font-medium text-sidebar-foreground hover:text-accent-foreground cursor-pointer transition-colors group"
        >
          <div className="text-muted-foreground/70 group-hover:text-foreground transition-colors duration-150">
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 shrink-0" />
            ) : (
              <ChevronRight className="h-4 w-4 shrink-0" />
            )}
          </div>
          <div className="text-blue-500 dark:text-blue-400 shrink-0 transition-transform group-hover:scale-105">
            {isExpanded ? (
              <FolderOpen className="h-4 w-4 fill-blue-500/10" />
            ) : (
              <FolderIcon className="h-4 w-4 fill-blue-500/10" />
            )}
          </div>
          <span className="truncate">{name}</span>
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent className="transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden">
        {hasChildren && (
          <ul className="list-none m-0 p-0 mt-0.5 space-y-0.5">
            {sortedEntries.map(([fileName, childData]) => {
              const childPath = `${path}/${fileName}`

              if (childData.directory) {
                return (
                  <li key={fileName}>
                    <Folder
                      name={fileName}
                      data={childData}
                      level={level + 1}
                      path={childPath}
                      isExpanded={expandedFolderPaths.includes(childPath)}
                      expandedFolderPaths={expandedFolderPaths}
                      onToggle={onToggle}
                    />
                  </li>
                )
              } else if (childData.file) {
                return (
                  <li key={fileName}>
                    <File name={fileName} data={childData.file.contents} level={level + 1} path={childPath} />
                  </li>
                )
              }
              return null
            })}
          </ul>
        )}
      </CollapsibleContent>
    </Collapsible>
  )
}

export default Folder