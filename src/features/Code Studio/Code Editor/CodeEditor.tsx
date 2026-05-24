'use client'

import { Allotment } from 'allotment'
import 'allotment/dist/style.css' // 1. Import the required CSS
import Directory from './Directory'
import dynamic from 'next/dynamic'
import MoncaoEditor from './Editor'

// 2. Disable SSR for Allotment because it relies on browser-only APIs
const AllotmentNoSSR = dynamic(() => import('allotment').then((mod) => mod.Allotment), {
  ssr: false,
})

const CodeEditor = ({ projectId }: { projectId: number }) => {
  return (
    // 3. Ensure the parent wrapper has an explicit height/width
    <div style={{ height: '100vh', width: '100%' }}>
      <AllotmentNoSSR>
        <Allotment.Pane minSize={100} maxSize={250} snap>
          <Directory projectId={projectId}/>
        </Allotment.Pane>
        <Allotment.Pane>
          <MoncaoEditor/>
        </Allotment.Pane>
      </AllotmentNoSSR>
    </div>
  )
}

export default CodeEditor
