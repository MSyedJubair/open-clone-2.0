'use client'

import { timeAgo } from "@/lib/utils"
import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, User } from "lucide-react"
import { useContext, useEffect, useRef } from "react"
import ProjectContext from "@/context/ProjectContext"

interface MessagesProps {
    projectId: number
}

const Messages = ({ projectId }: MessagesProps) => {
    const trpc = useTRPC()
    const { data: messages } = useSuspenseQuery(
        trpc.message.getMessages.queryOptions({ projectId: projectId })
    )

    const projectContext = useContext(ProjectContext)
    const isProcessing = projectContext.status === 'PROCESSING'

    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isProcessing])

    return (
        <ScrollArea className="h-150 w-full rounded-xl border border-zinc-800 bg-(--color-app-bg) p-6">
            <div className="flex flex-col gap-6">
                {messages?.map((message) => {
                    const isAI = message.role === 'AI'

                    return (
                        <div
                            key={message.id || message.createdAt.toString()}
                            className={`flex gap-3 text-sm max-w-[85%] ${isAI ? 'self-start' : 'self-end flex-row-reverse'
                                }`}
                        >
                            <Avatar className={`h-8 w-8 border shrink-0 ${isAI
                                ? 'border-(--color-brand-purple)/30'
                                : 'border-zinc-700'
                                }`}>
                                <AvatarFallback className={
                                    isAI
                                        ? 'bg-(--color-brand-purple)/10 text-(--color-brand-purple)'
                                        : 'bg-zinc-800 text-zinc-300'
                                }>
                                    {isAI ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                                </AvatarFallback>
                            </Avatar>

                            <div className={`flex flex-col gap-1.5 ${isAI ? 'items-start' : 'items-end'}`}>
                                <div
                                    className={`rounded-2xl px-4 py-2.5 shadow-md leading-relaxed ${isAI
                                        ? 'bg-(--color-app-surface) text-zinc-100 border border-zinc-800/80 rounded-tl-none'
                                        : 'bg-(--color-brand-indigo) text-white rounded-tr-none'
                                        }`}
                                >
                                    {message.message}
                                </div>

                                <span className="text-[10px] text-zinc-500 tracking-wide px-1">
                                    {timeAgo(message.createdAt)}
                                </span>
                            </div>
                        </div>
                    )
                })}

                {/* Styled AI Processing Indicator */}
                {isProcessing && (
                    <div className="flex items-center gap-3 self-start text-sm max-w-[85%]">
                        <Avatar className="h-8 w-8 border shrink-0 border-(--color-brand-purple)/30 animate-pulse">
                            <AvatarFallback className="bg-(--color-brand-purple)/10 text-(--color-brand-purple)">
                                <Bot className="h-4 w-4" />
                            </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex items-center gap-2 rounded-2xl rounded-tl-none border border-zinc-800/80 bg-(--color-app-surface) px-4 py-3 shadow-md text-zinc-400">
                            <div className="relative flex h-4 w-4 items-center justify-center">
                                <div className="absolute h-full w-full animate-spin rounded-full border-2 border-zinc-700 border-t-(--color-brand-purple)" />
                            </div>
                            <span className="text-xs font-medium tracking-wide">AI is thinking...</span>
                        </div>
                    </div>
                )}

                {/* Invisible element used as a scroll anchor */}
                <div ref={messagesEndRef} />
            </div>
        </ScrollArea>
    )
}

export default Messages