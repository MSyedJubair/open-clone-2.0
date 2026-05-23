'use client'

import { timeAgo } from "@/lib/utils"
import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, User } from "lucide-react"

interface MessagesProps {
    projectId: number
}

const Messages = ({ projectId }: MessagesProps) => {
    const trpc = useTRPC()
    const { data: messages } = useSuspenseQuery(
        trpc.message.getMessages.queryOptions({ projectId: projectId })
    )
    return (
        <ScrollArea className="h-[600px] w-full rounded-xl border border-zinc-800 bg-[var(--color-app-bg)] p-6">
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
                                ? 'border-[var(--color-brand-purple)]/30'
                                : 'border-zinc-700'
                                }`}>
                                <AvatarFallback className={
                                    isAI
                                        ? 'bg-[var(--color-brand-purple)]/10 text-[var(--color-brand-purple)]'
                                        : 'bg-zinc-800 text-zinc-300'
                                }>
                                    {isAI ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                                </AvatarFallback>
                            </Avatar>


                            <div className={`flex flex-col gap-1.5 ${isAI ? 'items-start' : 'items-end'}`}>
                                <div
                                    className={`rounded-2xl px-4 py-2.5 shadow-md leading-relaxed ${isAI
                                        ? 'bg-[var(--color-app-surface)] text-zinc-100 border border-zinc-800/80 rounded-tl-none'
                                        : 'bg-[var(--color-brand-indigo)] text-white rounded-tr-none'
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
            </div>
        </ScrollArea>
    )
}

export default Messages