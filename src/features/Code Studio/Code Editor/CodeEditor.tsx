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

const CodeEditor = () => {
  return (
    <div className='h-full w-full'>
      <AllotmentNoSSR separator>
        <Allotment.Pane minSize={100} maxSize={350} preferredSize={250} snap>
          <div style={{ paddingRight: "10px", height: "100%", width: '100%' }}>
            <Directory />
          </div>
        </Allotment.Pane>
        <Allotment.Pane >
          <div style={{ paddingLeft: "10px", height: "100%", width: '100%' }}>
            <MoncaoEditor />
          </div>
        </Allotment.Pane>
      </AllotmentNoSSR>
    </div>
  )
}

export default CodeEditor
