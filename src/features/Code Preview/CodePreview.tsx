'use client'

import { useContext } from 'react'
import WebContainerPreview from './WebContainer'
import WebContainerContext from '@/context/WebContainerContext'

const CodePreview = () => {
  const webContainerContext = useContext(WebContainerContext)
  let width = '100%'

  if (webContainerContext.tab === 'Desktop') {
    width = '100%'
  } else if (webContainerContext.tab === 'Tab') {
    width = '768px'
  } else if (webContainerContext.tab === 'Mobile') {
    width = '375px'
  }

  return (
    <div className='flex h-full w-full '>
        <WebContainerPreview width={width} />
    </div>
  )
}

export default CodePreview