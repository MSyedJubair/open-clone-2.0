import NewProject from '@/components/Shared/NewProject'
import ProjectsView from '@/features/Projects/ProjectsView'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { Zap } from 'lucide-react'
import { headers } from "next/headers"
import Link from 'next/link'

const page = async () => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  const isAuthenticated = Boolean(session)
  const user = session?.user;

  return (

    <div className="flex h-screen bg-app-bg text-zinc-100 font-sans overflow-hidden relative z-0">

      <div className="absolute inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full animate-drift"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-purple-600/10 blur-[150px] rounded-full animate-drift-slow"></div>
      </div>


      <main className="w-full flex flex-col relative overflow-y-auto">

        <header className="flex items-center justify-between p-8 sticky top-0 z-10 border-b border-transparent">
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-5 py-2 text-sm font-medium text-zinc-300 backdrop-blur-md">
            <Zap className="w-4 h-4 text-yellow-500 fill-yellow-500/20" />
            <span>120,400 tokens remaining</span>
          </div>
          <div></div>

          <NewProject isAuthenticated={isAuthenticated} />
        </header>

        <div className="w-full mx-auto px-8 py-20 flex-1 flex flex-col">
          <div className="flex flex-col items-center justify-center mt-12 mb-24">
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight text-center mb-10 leading-tight">
              What do you want to <br />
              <span className="bg-clip-text text-transparent bg-linear-to-tr from-indigo-400 via-purple-400 to-pink-400">
                build today?
              </span>
            </h1>

          </div>

          <div className="mt-auto pt-8 border-t border-white/5">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-semibold tracking-tight text-zinc-100">
                Recent Projects
              </h2>
              <Link
                href="/project"
                className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                View all projects
              </Link>
            </div>

            {user && (
              <ProjectsView authorId={user.id} />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default page
