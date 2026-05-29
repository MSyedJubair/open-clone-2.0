import { Project, User } from "@/app/generated/prisma/client";
import prisma from "@/lib/prisma";
import { timeAgo } from "@/lib/utils";
import { caller } from "@/trpc/server";
import { Clock, LayoutDashboard, MoreVertical, FileText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ProjectsViewProps {
  authorId?: string;
}

const ProjectsView = async ({ authorId }: { authorId?: string }) => {
  const projects = await caller.project.getProjects({ authorId });

  // Guard clause for early return if no projects exist
  if (!projects || projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border border-dashed border-white/10 rounded-2xl bg-app-surface/20">
        <LayoutDashboard className="w-8 h-8 text-zinc-600 mb-2" />
        <p className="text-zinc-400 font-medium">No projects found</p>
      </div>
    );
  }

  // Fetch unique authors in a single query block
  const authorIds = [...new Set(projects.map((p) => p.authorId))];
  const users = await prisma.user.findMany({
    where: { id: { in: authorIds } },
  });

  const usersMap = new Map(users.map((user) => [user.id, user]));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => {
        const author = usersMap.get(project.authorId);

        return (
          <div
            key={project.id}
            className="group relative bg-app-surface/40 backdrop-blur-md border border-white/5 hover:border-indigo-500/30 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(99,102,241,0.12)] flex flex-col justify-between min-h-[240px]"
          >
            
            <div className="absolute top-6 right-6 z-10">
              <button className="text-zinc-500 hover:text-white bg-white/0 hover:bg-white/5 p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>

            
            <Link href={`/project/${project.id}`} className="flex-1 block">
              
              <div className="flex justify-between items-center mb-5">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-indigo-500/10 group-hover:border-indigo-500/20 transition-all duration-300">
                  <LayoutDashboard className="w-5 h-5 text-zinc-400 group-hover:text-indigo-400 transition-colors" />
                </div>

                {project.status && (
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full border mr-8 group-hover:mr-0 transition-all ${
                      project.status === "COMPLETED"
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                        : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                    }`}
                  >
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1).toLowerCase()}
                  </span>
                )}
              </div>

              
              <div className="space-y-2">
                <h3 className="font-semibold text-lg text-white group-hover:text-indigo-300 transition-colors truncate pr-6">
                  {project.name}
                </h3>
                {project.description && (
                  <p className="text-sm text-zinc-400 line-clamp-2 leading-relaxed font-light">
                    {project.description}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-4 text-xs font-medium text-zinc-500 mt-4 pt-4 border-t border-white/5">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {timeAgo(project.createdAt)}
                </span>
                
                {project.files && (
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    Assets Added
                  </span>
                )}
              </div>
            </Link>

            
            <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
              {author && (
                <div className="flex items-center gap-2.5">
                  <div className="relative w-7 h-7 rounded-full overflow-hidden bg-zinc-800 border border-white/10 ring-2 ring-transparent group-hover:ring-indigo-500/20 transition-all">
                    {author.image ? (
                      <Image
                        src={author.image}
                        alt={`${author.name}'s avatar`}
                        fill
                        className="object-cover"
                        sizes="28px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-400 uppercase font-bold">
                        {author.name?.slice(0, 2)}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-zinc-300 group-hover:text-white transition-colors">
                      {author.name}
                    </span>
                    <span className="text-[10px] text-zinc-500 truncate max-w-[120px]">
                      {author.email}
                    </span>
                  </div>
                </div>
              )}
            </div>

          </div>
        );
      })}
    </div>
  );
};

export default ProjectsView;