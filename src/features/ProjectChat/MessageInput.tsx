'use client'

import { Button, Input } from "@base-ui/react"
import { Send } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useTRPC } from "@/trpc/client"
import { useState, useContext } from "react"
import { Message, ProjectStatus } from "@/app/generated/prisma/client"
import ProjectContext from "@/context/ProjectContext"
import { toast } from "sonner"

const MessageInput = ({ projectId }: { projectId: number }) => {
    const trpc = useTRPC()
    const queryClient = useQueryClient()

    const projectContext = useContext(ProjectContext)

    const [message, setMessage] = useState('')

    const messagesQueryKey = trpc.message.getMessages.queryKey({ projectId })
    const projectQueryKey = trpc.project.getProject.queryKey()

    const { mutateAsync: sendMessage } = useMutation({
        ...trpc.message.sendMessage.mutationOptions({
            onMutate: async (variables) => {
                await queryClient.cancelQueries({ queryKey: messagesQueryKey })

                const previousMessages = queryClient.getQueryData(messagesQueryKey)

                queryClient.setQueryData<Message[]>(messagesQueryKey, (old) => {
                    const optimisticMessage: Message = {
                        id: Date.now(),
                        role: 'USER',
                        message: variables.message,
                        projectId: variables.projectId,
                        createdAt: new Date()
                    }
                    return old ? [...old, optimisticMessage] : [optimisticMessage]
                })

                return { previousMessages }
            },
            onError: (err, variables, context) => {
                if (context?.previousMessages) {
                    queryClient.setQueryData(messagesQueryKey, context.previousMessages)
                }
                console.error("Message failed to send:", err)
            },
            onSettled: () => {
                queryClient.invalidateQueries({ queryKey: messagesQueryKey })
                queryClient.invalidateQueries({ queryKey: projectQueryKey })
            },
        }),
    })

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!message.trim()) return

        const messageToSend = message
        setMessage('')

        const currentStatus = projectContext.status

        projectContext.setStatus('PROCESSING')

        try {
            await sendMessage({
                projectId: projectId,
                message: messageToSend
            })
        } catch {
            setMessage(messageToSend)
            toast('You do not have permission to modify this project. It belongs to someone else')
            projectContext.setStatus(currentStatus as unknown as ProjectStatus)
        }
    }

    return (
        <form
            onSubmit={handleSend}
            className="p-3 border-t border-gray-200 dark:border-zinc-800 flex gap-2 items-center bg-white dark:bg-zinc-950"
        >
            <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 border border-gray-200 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent text-gray-900 dark:text-zinc-100"
            />
            <Button
                type="submit"
                disabled={!message.trim()}
                className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:dark:bg-zinc-800 text-white rounded-lg transition-colors flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
            >
                <Send className="h-4 w-4" />
            </Button>
        </form>
    )
}

export default MessageInput