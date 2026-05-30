'use client'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    Folder,
    Layers,
    User
} from "lucide-react";

const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Projects", href: "/projects", icon: Folder },
    { name: "MyProjects", href: "/projects/me", icon: Layers },
    { name: "Profile", href: "/profile", icon: User },
];

const SideBarItems = ({ isCollapsed }: { isCollapsed: boolean }) => {
    const pathname = usePathname();

    return (
        <nav className="space-y-1.5">
            {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                    <Tooltip key={item.href} disableHoverableContent={!isCollapsed}>
                        <TooltipTrigger {...(!isCollapsed ? { asChild: false } : {})} asChild>
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
                                    <div className="absolute left-0 w-0.75 h-5 bg-indigo-500 rounded-r-full layout-glow" />
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
    )
}

export default SideBarItems