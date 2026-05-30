"use client";

import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import SideBarUser from "./SideBarUser";
import { useState } from "react";
import SideBarItems from "./SideBarItems";
import SideBarHeader from "./SideBarHeader";

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <TooltipProvider delayDuration={0}>
      <div
        className={cn(
          "relative flex flex-col justify-between h-screen bg-zinc-950 text-zinc-200 p-4 transition-all duration-300 ease-in-out select-none border-r border-zinc-900",
          isCollapsed ? "w-19.5" : "w-64"
        )}
      >
        <div className="flex flex-col gap-20">
          <SideBarHeader isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed}/>
          <SideBarItems isCollapsed={isCollapsed}/>

        </div>
        <SideBarUser isCollapsed={isCollapsed} />
      </div>
    </TooltipProvider>
  );
}