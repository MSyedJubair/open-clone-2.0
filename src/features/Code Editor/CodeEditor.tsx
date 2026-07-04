'use client'

import { Allotment } from 'allotment'
import 'allotment/dist/style.css'
import Directory from './Directory'
import dynamic from 'next/dynamic'
import MoncaoEditor from './Editor'

const AllotmentNoSSR = dynamic(() => import('allotment').then((mod) => mod.Allotment), {
  ssr: false,
})

const CodeEditor = () => {
  return (
    <div className='h-full w-full rounded-2xl project-card p-2'>
      <AllotmentNoSSR separator className='h-full rounded-xl'>
        <Allotment.Pane minSize={100} maxSize={350} preferredSize={250} snap>
          <div className='h-full w-full pr-2'>
            <Directory />
          </div>
        </Allotment.Pane>
        <Allotment.Pane>
          <div className='h-full w-full pl-2'>
            <MoncaoEditor />
          </div>
        </Allotment.Pane>
      </AllotmentNoSSR>
    </div>
  )
}

export default CodeEditor
