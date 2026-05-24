'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code2, Eye } from "lucide-react"
import CodeEditor from "./Code Editor/CodeEditor"
import CodePreview from "./Code Preview/CodePreview"

const CodeStudio = ({ projectId }: { projectId: number }) => {
  return (
    <div className="w-full h-full mx-auto border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-zinc-50/50 dark:bg-zinc-950 shadow-sm">
      <Tabs defaultValue="preview" className="w-full">
        
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-zinc-200 dark:bg-zinc-800" />
              <span className="w-3 h-3 rounded-full bg-zinc-200 dark:bg-zinc-800" />
              <span className="w-3 h-3 rounded-full bg-zinc-200 dark:bg-zinc-800" />
            </div>
          </div>

          <TabsList className="grid grid-cols-2 w-55 h-9 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
            <TabsTrigger 
              value="preview" 
              className="flex items-center justify-center gap-1.5 text-xs font-medium transition-all"
            >
              <Eye className="w-3.5 h-3.5" />
              Preview
            </TabsTrigger>
            <TabsTrigger 
              value="code"
              className="flex items-center justify-center gap-1.5 text-xs font-medium transition-all"
            >
              <Code2 className="w-3.5 h-3.5" />
              Code
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="p-4 bg-white dark:bg-zinc-900/50 min-h-112.5">
          
          <TabsContent value="preview" className="mt-0 outline-none focus-visible:outline-none">
            <div className="rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800 p-6 min-h-104.5 flex items-center justify-center bg-zinc-50/50 dark:bg-zinc-950/40 pattern-grid">
              <CodePreview />
            </div>
          </TabsContent>
          
          <TabsContent value="code" className="mt-0 outline-none focus-visible:outline-none">
            <div className="rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 min-h-104.5 bg-zinc-950 text-zinc-50">
              <CodeEditor projectId={projectId} />
            </div>
          </TabsContent>

        </div>
      </Tabs>
    </div>
  )
}

export default CodeStudio