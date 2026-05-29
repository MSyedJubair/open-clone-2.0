import ProjectsView from '@/features/Projects/ProjectsView'
import React from 'react'
import { Search, SlidersHorizontal, Globe, Users, FolderGit2, Sparkles } from 'lucide-react'

// Mock stats for the public layout header — you can later fetch these reactively
const PUBLIC_STATS = [
  { label: "Active Creators", value: "1,240+", icon: Users, color: "text-indigo-400 bg-indigo-500/10" },
  { label: "Public Projects", value: "3,890+", icon: FolderGit2, color: "text-emerald-400 bg-emerald-500/10" },
  { label: "Inspirations", value: "42k", icon: Sparkles, color: "text-amber-400 bg-amber-500/10" },
];

const Projects = () => {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 selection:bg-indigo-500/30">
      
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-indigo-600/10 via-transparent to-transparent blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        
        
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-8 border-b border-white/5">
          <div>
            <div className="flex items-center gap-2 px-3 py-1 text-xs font-medium text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-full w-fit mb-3">
              <Globe className="w-3.5 h-3.5 animate-pulse" />
              Public Discovery Hub
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Explore Community Projects
            </h1>
            <p className="mt-2 text-zinc-400 max-w-xl">
              Discover, learn, and collaborate on amazing building pieces crafted by developers worldwide.
            </p>
          </div>

          
          <div className="grid grid-cols-3 gap-4 sm:gap-6 min-w-full md:min-w-[400px]">
            {PUBLIC_STATS.map((stat, idx) => (
              <div key={idx} className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col items-start">
                <div className={`p-2 rounded-xl mb-2 ${stat.color}`}>
                  <stat.icon className="w-4 h-4" />
                </div>
                <span className="text-xl font-bold text-white tracking-tight">{stat.value}</span>
                <span className="text-[11px] text-zinc-500 font-medium mt-0.5">{stat.label}</span>
              </div>
            ))}
          </div>
        </header>

        
        <section className="flex flex-col sm:flex-row items-center justify-between gap-4 my-8">
          
          <div className="relative w-full sm:max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Search projects, stack, or creators..."
              className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all duration-200"
            />
          </div>

          
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 hover:border-white/20 rounded-xl text-sm font-medium text-zinc-300 transition-all">
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
            </button>
            
            <button className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-600/20 hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all duration-200">
              Share Your Project
            </button>
          </div>
        </section>

        
        <main className="mt-4">
          
          <ProjectsView />
        </main>

      </div>
    </div>
  )
}

export default Projects