'use client'

import React from 'react'
import { FileText } from 'lucide-react'

type FileProps = {
  name: string,
  data: string,
  level: number,
  isSelected: boolean,
  onClick: () => void
}

const File = ({ name, data, level = 1, isSelected, onClick }: FileProps) => {
  return (
    <div
      style={{ paddingLeft: `${level * 16 + 24}px` }}
      className={`flex items-center gap-2 py-1.5 pr-2 rounded-md hover:bg-muted/50 text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors group select-none ${isSelected && 'text-foreground'}`}
      onClick={onClick}
    >

      <FileText className="h-4 w-4 shrink-0 text-muted-foreground/60 group-hover:text-muted-foreground transition-colors" />

      <span className="truncate font-medium">{name}</span>
    </div>
  )
}

export default File