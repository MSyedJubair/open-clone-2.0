'use client'

import { CopyMinus } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CollapseAllButtonProps {
  onCollapseAll: () => void
}

const CollapseAllButton = ({ onCollapseAll }: CollapseAllButtonProps) => {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onCollapseAll}
      className="h-7 gap-1.5 px-2.5 text-[0.8rem]"
      title="Collapse All"
    >
      <CopyMinus className="h-3.5 w-3.5" />
    </Button>
  )
}

export default CollapseAllButton
