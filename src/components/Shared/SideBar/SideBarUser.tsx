'use client'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    LogOut,
    Settings,
    ChevronUp
} from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Skeleton } from "../../ui/skeleton";
import { cn } from "@/lib/utils";

const SideBarUser = ({ isCollapsed }: { isCollapsed: boolean }) => {
    const {
        data: session,
        isPending
    } = authClient.useSession()
    const user = session?.user

    const router = useRouter()

    return (
        <div className="pt-4">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    {isPending ? (
                        <div
                            className={cn(
                                "flex items-center gap-3 w-full p-2 rounded-xl bg-zinc-900/40 border border-zinc-900/60",
                                isCollapsed ? "justify-center" : ""
                            )}
                        >
                            <Skeleton className="h-8 w-8 rounded-full shrink-0" />

                            {!isCollapsed && (
                                <div className="flex flex-row gap-4 flex-1 items-center">
                                    <div className="flex flex-col flex-1 gap-1">
                                        <Skeleton className="h-3 w-24" />
                                        <Skeleton className="h-3 w-36" />
                                    </div>
                                    <Skeleton className="h-4 w-4" />
                                </div>
                            )}
                        </div>
                    ) : (
                        <button
                            className={cn(
                                "flex items-center gap-3 w-full p-2 rounded-xl bg-zinc-900/40 border border-zinc-900/60 hover:bg-zinc-900 hover:border-zinc-800 transition-all text-left outline-none group backdrop-blur-sm",
                                isCollapsed ? "justify-center" : ""
                            )}
                        >
                            <Avatar className="h-8 w-8 shrink-0 ring-2 ring-zinc-800 group-hover:ring-zinc-700 transition-all flex justify-center items-center">
                                {user?.image ? (
                                    <AvatarImage src={user.image} alt={user.name ?? "User"} />
                                ) : (
                                    <div className="text-center text-blue-300">{user?.name.at(0)?.toUpperCase()}</div>
                                )}
                            </Avatar>

                            {!isCollapsed && (
                                <div className="flex flex-row gap-4 flex-1 min-w-0 items-center">
                                    <div className="flex flex-col flex-1 min-w-0">
                                        <span className="text-xs font-semibold text-zinc-300 truncate group-hover:text-zinc-100">
                                            {user?.name ?? "Unknown User"}
                                        </span>

                                        <span className="text-[11px] text-zinc-500 truncate">
                                            {user?.email}
                                        </span>
                                    </div>

                                    <ChevronUp className="h-4 w-4 text-zinc-500 shrink-0" />
                                </div>
                            )}
                        </button>
                    )}
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    side={isCollapsed ? "right" : "top"}
                    align={isCollapsed ? "center" : "end"}
                    sideOffset={8}
                    className="w-52 bg-zinc-900 text-zinc-200 border-zinc-800 shadow-xl rounded-lg"
                >
                    <DropdownMenuItem className="focus:bg-zinc-800 focus:text-zinc-100 cursor-pointer gap-2 text-xs py-2">
                        <Settings className="h-3.5 w-3.5 text-zinc-400" /> Account Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem className="focus:bg-red-950/40 focus:text-red-400 text-red-400/90 cursor-pointer gap-2 text-xs py-2">
                        <button onClick={() => {
                            authClient.signOut({
                                fetchOptions: {
                                    onSuccess: () => {
                                        router.push('/')
                                    }
                                }
                            })
                        }} className="flex flex-row gap-2"><LogOut className="h-3.5 w-3.5" /> Log out</button>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default SideBarUser