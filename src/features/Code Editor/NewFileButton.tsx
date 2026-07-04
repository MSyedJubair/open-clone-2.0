'use client'

import { FilePlus2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface NewFileButtonProps {
  onCreateFile: () => void
}

const NewFileButton = ({ onCreateFile }: NewFileButtonProps) => {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onCreateFile}
      className="h-7 gap-1.5 px-2.5 text-[0.8rem]"
      title="New File"
    >
      <FilePlus2 className="h-3.5 w-3.5" />
    </Button>
  )
}

export default NewFileButton
