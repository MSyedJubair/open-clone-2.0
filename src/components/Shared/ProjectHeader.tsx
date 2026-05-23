'use client'

import { ChevronRight, Clock } from "lucide-react"
import Image from "next/image"
import { timeAgo } from "@/lib/utils"
import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery  } from "@tanstack/react-query"
import { authClient } from "@/lib/auth-client"
import Link from "next/link"

const ProjectHeader = ({ projectId }: { projectId: number }) => {
  const trpc = useTRPC()
  const { data: project, isLoading: isProjectLoading } = useSuspenseQuery (
    trpc.project.getProject.queryOptions({ projectId: projectId })
  )
  const { data: session, isPending: isUserLoading } = authClient.useSession()

  const getStatusStyles = (status?: string) => {
    if (!status) return { text: "text-zinc-500", dot: "bg-zinc-500" }
    
    switch (status) {
      case "COMPLETED":
      case "LIVE":
        return { text: "text-[var(--color-status-live)]", dot: "bg-[var(--color-status-live)]" }
      case "DRAFT":
        return { text: "text-[var(--color-status-draft)]", dot: "bg-[var(--color-status-draft)]" }
      default:
        return { text: "text-[var(--color-status-token)]", dot: "bg-[var(--color-status-token)]" }
    }
  }

  const statusStyle = getStatusStyles(project?.status)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/50 bg-[var(--color-app-bg)]/80 backdrop-blur-xl">
      <div className="flex h-14 items-center justify-between px-6">
        
        
        <div className="flex items-center gap-3 overflow-hidden">
          <Link
            href="/"
            className="flex items-center gap-2.5 transition-all hover:opacity-80 active:scale-95 shrink-0"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-app-surface)] border border-zinc-800 shadow-inner">
              <Image
                src="/Logo.png"
                alt="Logo"
                width={18}
                height={18}
                className="brightness-110 tracking-tight"
              />
            </div>
            <span className="hidden text-sm font-semibold tracking-tight text-zinc-200 md:block">
              OpenClone
            </span>
          </Link>

          <ChevronRight className="h-4 w-4 shrink-0 text-zinc-300" />

          {isProjectLoading ? (
            
            <div className="flex items-center gap-3 animate-pulse">
              <div className="h-4 w-28 rounded bg-zinc-800" />
              <div className="hidden h-5 w-20 rounded-full bg-zinc-800/60 lg:block" />
            </div>
          ) : (
            <div className="flex items-center gap-3 min-w-0">
              <span className="truncate text-sm font-medium text-white">
                {project?.name || "Untitled Project"}
              </span>

              <div className="hidden items-center gap-1.5 rounded-full border border-zinc-800/80 bg-[var(--color-app-surface)] px-2.5 py-0.5 text-[11px] font-medium text-zinc-400 shadow-sm lg:flex">
                <Clock className="h-3 w-3 text-zinc-500" />
                <span>{timeAgo(project?.createdAt || "")}</span>
              </div>
            </div>
          )}
        </div>

        
        <div className="flex items-center gap-4">
          {!isProjectLoading && project?.status && (
            <div className="hidden sm:flex items-center gap-3 pr-4 border-r border-zinc-800/60">
              <div className="flex items-center gap-2 text-[12px] bg-[var(--color-app-surface)] px-2.5 py-1 rounded-lg border border-zinc-800/40 cursor-default">
                <div className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot} animate-pulse`} />
                <span className={`font-semibold tracking-wide text-[10px] uppercase ${statusStyle.text}`}>
                  {project.status}
                </span>
              </div>
            </div>
          )}

          {isUserLoading ? (
            
            <div className="flex items-center gap-3 animate-pulse">
              <div className="hidden h-3 w-16 rounded bg-zinc-800 md:block" />
              <div className="h-9 w-9 rounded-full bg-zinc-800" />
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="text-right hidden md:block">
                <p className="text-xs font-semibold text-zinc-200 leading-none">
                  {session?.user.name || "Anonymous"}
                </p>
              </div>

              <button className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--color-brand-indigo)]/30 bg-[var(--color-brand-indigo)]/10 shadow-sm transition-all hover:border-[var(--color-brand-purple)]/50 active:scale-95 overflow-hidden group">
                {session?.user.image ? (
                  <Image
                    src={session?.user.image}
                    alt="Profile"
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <span className="text-xs font-bold text-[var(--color-brand-indigo)] uppercase tracking-wider">
                    {session?.user.name?.[0] || "?"}
                  </span>
                )}
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  )
}

export default ProjectHeader;