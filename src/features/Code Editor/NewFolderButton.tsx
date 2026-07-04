'use client'

import { FolderPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface NewFolderButtonProps {
  onCreateFolder: () => void
}

const NewFolderButton = ({ onCreateFolder }: NewFolderButtonProps) => {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onCreateFolder}
      className="h-7 gap-1.5 px-2.5 text-[0.8rem]"
      title="New Folder"
    >
      <FolderPlus className="h-3.5 w-3.5" />
    </Button>
  )
}

export default NewFolderButton
