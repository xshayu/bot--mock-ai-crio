'use client';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenuButton,
    SidebarSeparator
} from "@/components/ui/sidebar";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem
} from '@/components/ui/dropdown-menu';
import { SquarePen, FileClock, SunMoon } from 'lucide-react';
import { useTheme } from "next-themes";
  
export function AppSidebar() {
    const { setTheme } = useTheme();

    return (
        <Sidebar>

            <SidebarHeader>
                <SidebarMenuButton>
                    New Chat
                    <SquarePen className="ml-auto" />
                </SidebarMenuButton>
            </SidebarHeader>

            <SidebarSeparator />

            <SidebarContent>
                <div className="flex flex-col w-full h-full items-center justify-center gap-2 text-sm opacity-50 [&>svg]:size-4 [&>svg]:shrink-0">
                    <span>
                        Past convos will show here
                    </span>
                    <FileClock />
                </div>
            </SidebarContent>

            <SidebarSeparator />
            
            <SidebarFooter>
                <SidebarMenuButton>
                    All Past Conversations
                    <FileClock className="ml-auto" />
                </SidebarMenuButton>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton>
                            Theme
                            <SunMoon className="ml-auto" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setTheme("light")}>
                            Light
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("dark")}>
                            Dark
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("system")}>
                            System
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
  