'use client'

import React, { useContext } from 'react'
import { FileText } from 'lucide-react'
import DirectoryContext from '@/context/DirectoryContext'

type FileProps = {
  name: string,
  data: string,
  level: number,
  path: string
}

const File = ({ name, data, level = 1, path }: FileProps) => {
  const context = useContext(DirectoryContext)

  return (
    <div
      style={{ paddingLeft: `${level * 16 + 24}px` }}
      className={`flex items-center gap-2 py-1.5 pr-2 rounded-md hover:bg-muted/50 text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors group select-none ${context.filePath === path
        ? 'bg-muted text-foreground'
        : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
        }`}
      onClick={() => {
        if (context.filePath === path) {
          context.setFilePath('')
        } else {
          context.setFilePath(path)
        }        
      }}
    >

      <FileText className="h-4 w-4 shrink-0 text-muted-foreground/60 group-hover:text-muted-foreground transition-colors" />

      <span className="truncate font-medium">{name}</span>
    </div>
  )
}

export default File