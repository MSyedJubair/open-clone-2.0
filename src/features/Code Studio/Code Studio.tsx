'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code2, Eye, Monitor, Tablet, Smartphone } from "lucide-react"
import CodeEditor from "../Code Editor/CodeEditor"
import CodePreview from "../Code Preview/CodePreview"
import { useContext, useState } from "react"
import WebContainerContext from "@/context/WebContainerContext"

const CodeStudio = () => {
  const webContainerContext = useContext(WebContainerContext)

  const [activeViewport, setActiveViewport] = useState('Desktop')

  const handleViewportChange = (view: string) => {
    setActiveViewport(view)
    if (webContainerContext?.setTab) {
      webContainerContext.setTab(view)
    }
  }

  return (
    <div className="w-full h-full mx-auto border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-zinc-50/50 dark:bg-zinc-950 shadow-sm">
      <Tabs defaultValue="preview" className="w-full h-full flex flex-col">

        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">

          <div className="flex items-center gap-6">
            {/* Changed w-60 to w-64 for slightly better spacing */}
            <div className="grid grid-cols-3 w-64 h-9 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
              {['Desktop', 'Tab', 'Mobile'].map((view) => {
                const isActive = activeViewport === view
                return (
                  <button
                    key={view}
                    onClick={() => handleViewportChange(view)}
                    // Removed the rogue 'p-10' class here
                    className={`flex items-center justify-center gap-1.5 text-xs font-medium transition-all rounded-md ${isActive
                        ? "bg-white dark:bg-zinc-950 shadow-sm text-zinc-950 dark:text-zinc-50"
                        : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                      }`}
                  >
                    {view === 'Desktop' && <Monitor className="w-3.5 h-3.5" />}
                    {view === 'Tab' && <Tablet className="w-3.5 h-3.5" />}
                    {view === 'Mobile' && <Smartphone className="w-3.5 h-3.5" />}
                    {view === 'Tab' ? 'Tablet' : view}
                  </button>
                )
              })}
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

        <div className="p-4 bg-white dark:bg-zinc-900/50 h-full relative flex flex-col flex-1 overflow-hidden">

          <TabsContent
            value="preview"
            forceMount
            className="mt-0 outline-none focus-visible:outline-none data-[state=inactive]:hidden h-full flex flex-col"
          >
            {/* Added animate-in fade-in for smooth transitions */}
            <div className="animate-in fade-in zoom-in-[0.98] duration-300 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800 p-6 h-full flex items-center justify-center bg-zinc-50/50 dark:bg-zinc-950/40 pattern-grid flex-1 flex-col">
              <CodePreview />
            </div>
          </TabsContent>

          <TabsContent
            value="code"
            forceMount
            className="mt-0 outline-none focus-visible:outline-none data-[state=inactive]:hidden h-full flex flex-col"
          >
            {/* Added animate-in fade-in for smooth transitions */}
            <div className="animate-in fade-in zoom-in-[0.98] duration-300 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 h-full flex flex-1 bg-zinc-950 text-zinc-50">
              <CodeEditor />
            </div>
          </TabsContent>

        </div>
      </Tabs>
    </div>
  )
}

export default CodeStudio