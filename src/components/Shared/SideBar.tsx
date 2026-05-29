"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Folder, 
  Layers, 
  User, 
  ChevronLeft, 
  ChevronRight, 
  LogOut,
  Settings,
  Sparkles
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Projects", href: "/projects", icon: Folder },
  { name: "MyProjects", href: "/my-projects", icon: Layers },
  { name: "Profile", href: "/profile", icon: User },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const pathname = usePathname();

  return (
    <TooltipProvider delayDuration={0}>
      <div
        className={cn(
          "relative flex flex-col justify-between h-screen bg-zinc-950 text-zinc-200 p-4 transition-all duration-300 ease-in-out select-none border-r border-zinc-900",
          isCollapsed ? "w-[78px]" : "w-64"
        )}
      >
        
        <div className="flex flex-col gap-8">
          
          <div className={cn(
            "flex items-center h-10 px-2",
            isCollapsed ? "justify-center" : "justify-between"
          )}>
            {!isCollapsed && (
              <div className="flex items-center gap-2 font-medium text-sm tracking-wider uppercase text-zinc-400">
                <Image src={'/Logo.png'} alt="Logo" width={40} height={40}/>
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

          
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Tooltip key={item.href} disableHoverableContent={!isCollapsed}>
                  <TooltipTrigger { ...(!isCollapsed ? { asChild: false } : {}) } asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-4 px-3 py-2.5 rounded-md text-sm font-medium transition-all group relative",
                        isActive
                          ? "text-zinc-100"
                          : "text-zinc-500 hover:text-zinc-200"
                      )}
                    >
                      
                      {isActive && (
                        <div className="absolute left-0 w-[3px] h-5 bg-indigo-500 rounded-r-full layout-glow" />
                      )}

                      <Icon className={cn(
                        "h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-105",
                        isActive ? "text-indigo-400" : "text-zinc-500 group-hover:text-zinc-300"
                      )} />
                      
                      <span className={cn(
                        "transition-opacity duration-200",
                        isCollapsed ? "opacity-0 pointer-events-none absolute" : "opacity-100"
                      )}>
                        {item.name}
                      </span>
                    </Link>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side="right" className="bg-zinc-900 text-zinc-100 border-zinc-800 ml-2">
                      {item.name}
                    </TooltipContent>
                  )}
                </Tooltip>
              );
            })}
          </nav>
        </div>

        
        <div className="pt-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={cn(
                "flex items-center gap-3 w-full p-2 rounded-xl bg-zinc-900/40 border border-zinc-900/60 hover:bg-zinc-900 hover:border-zinc-800 transition-all text-left outline-none group backdrop-blur-sm",
                isCollapsed ? "justify-center" : ""
              )}>
                <Avatar className="h-8 w-8 shrink-0 ring-2 ring-zinc-800 group-hover:ring-zinc-700 transition-all">
                  <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=faces" alt="Profile" />
                  <AvatarFallback className="bg-zinc-800 text-zinc-400">JD</AvatarFallback>
                </Avatar>
                
                {!isCollapsed && (
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-xs font-semibold text-zinc-300 truncate group-hover:text-zinc-100">
                      Jane Doe
                    </span>
                    <span className="text-[11px] text-zinc-500 truncate">
                      jane.doe@example.com
                    </span>
                  </div>
                )}
              </button>
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
                <LogOut className="h-3.5 w-3.5" /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </TooltipProvider>
  );
}