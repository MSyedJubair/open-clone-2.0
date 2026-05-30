import ProjectsView from "@/features/Projects/ProjectsView";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { FolderGit2, Settings, User as UserIcon, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import NewProject from "@/components/Shared/NewProject";

const ProjectMe = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user = session?.user;
  const isAuthenticated = Boolean(user)

  if (!user?.id) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4 text-red-400">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
        <p className="text-zinc-400 max-w-sm mb-6 text-sm">
          Please sign in to view your personal dashboard and manage your projects.
        </p>
        <Link
          href="/login"
          className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-sm font-medium transition-colors"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app-bg text-zinc-100 relative">

      <div className="absolute top-0 right-0 w-100 h-100 bg-indigo-500/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">


        <div className="bg-linear-to-r from-zinc-900 via-zinc-900/90 to-zinc-900/40 border border-white/5 rounded-3xl p-6 sm:p-8 mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4.5">

            <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-zinc-800 border-2 border-white/10 ring-4 ring-indigo-500/10 shrink-0">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={`${user.name}'s profile picture`}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-zinc-400">
                  <UserIcon className="w-6 h-6" />
                </div>
              )}
            </div>


            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-white">
                  {user.name || "My Workspace"}
                </h1>
              </div>
              <p className="text-sm text-zinc-400 font-light">
                Manage your creative deployments, files, and public showcases.
              </p>
            </div>
          </div>


          <div className="flex items-center gap-3 self-end sm:self-center">
            <Link
              href="/settings"
              className="p-2.5 bg-white/2 hover:bg-white/6 border border-white/10 rounded-xl text-zinc-400 hover:text-white transition-all"
              title="Account Settings"
            >
              <Settings className="w-4 h-4" />
            </Link>
            <NewProject isAuthenticated={isAuthenticated} />
          </div>
        </div>


        <section className="space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-white/5">
            <FolderGit2 className="w-4 h-4 text-indigo-400" />
            <h2 className="text-lg font-semibold text-white">Your Projects</h2>
          </div>
          <ProjectsView authorId={user.id} />
        </section>

      </div>
    </div>
  );
};

export default ProjectMe;