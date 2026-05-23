import MessageInput from "./MessageInput"
import Messages from "./Messages"

interface ProjectChatProps {
  projectId: number
}

const ProjectChat = ({ projectId }: ProjectChatProps) => {
  return (
    <div className="flex flex-col h-full w-full max-w-2xl border border-gray-200 rounded-xl shadow-sm overflow-hidden bg-white dark:bg-zinc-950 dark:border-zinc-800">

      <div className="px-4 py-3 border-b border-gray-100 dark:border-zinc-900 bg-gray-50/50 dark:bg-zinc-900/50">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-zinc-300">Project Chat</h3>
      </div>

      <Messages projectId={projectId} />
      <MessageInput projectId={projectId}/>
    </div>
  )
}

export default ProjectChat