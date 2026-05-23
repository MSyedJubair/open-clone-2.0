'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useTRPC } from '@/trpc/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Spinner } from '../ui/spinner'
import { Loader2, LogIn, Plus } from 'lucide-react'

const NewProject = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
  const trpc = useTRPC()
  const router = useRouter()

  const [isRedirecting, setIsRedirecting] = useState(false);

  const { mutateAsync: createProject, isPending, isSuccess } = useMutation(trpc.project.newProject.mutationOptions())


  const handleCreateProject = async () => {
    try {
      const projectId = await createProject();

      if (projectId) {
        setIsRedirecting(true);
        toast.success("Project created! Redirecting...");
        router.push(`/project/${projectId}`);
      }
    } catch {
      toast.error("Failed to create project.");
      setIsRedirecting(false);
    }
  };

  const handleLoginRedirect = () => {
    setIsRedirecting(true);
    router.push("/sign-in");
  };

  return (
    <div>
      {isAuthenticated ? (
        <button
          className="bg-white text-black px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-zinc-200 hover:scale-105 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)] disabled:opacity-70 disabled:hover:scale-100"
          onClick={handleCreateProject}
          disabled={isPending || isRedirecting}
        >
          {isPending ? (
            <>
              <Spinner />
              <span>Creating...</span>
            </>
          ) : isSuccess ? (
            <>
              <Spinner />
              <span>Success</span>
            </>
          )
            : isRedirecting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Moving to Project...</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>New Project</span>
              </>
            )}
        </button>
      ) : (
        <button
          className="bg-zinc-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-zinc-700 hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-50"
          onClick={handleLoginRedirect}
          disabled={isRedirecting}
        >
          {isRedirecting ? (
            <Spinner />
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              Login to Create
            </>
          )}
        </button>
      )}
    </div>
  )
}

export default NewProject