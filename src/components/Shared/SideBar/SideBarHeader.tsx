'use client'

import { cn } from "@/lib/utils"
import React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";


const SideBarHeader = ({ isCollapsed, setIsCollapsed }: { isCollapsed: boolean, setIsCollapsed: React.Dispatch<boolean> }) => {
    return (
        <div className={cn(
            "flex items-center h-10 px-2",
            isCollapsed ? "justify-center" : "justify-between"
        )}>
            {!isCollapsed && (
                <div className="flex items-center gap-2 font-medium text-sm tracking-wider uppercase text-zinc-400">
                    <Image src={'/Logo.png'} alt="Logo" width={40} height={40} />
                    <span>OpenClone</span>
                </div>
            )}
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="h-8 w-8 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900 rounded-full"
            >
                {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
        </div>
    )
}

export default SideBarHeader