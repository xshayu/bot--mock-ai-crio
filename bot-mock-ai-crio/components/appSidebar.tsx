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
import { useConvoStore } from "@/stores/useConvoStore";
import Link from "next/link";
import { memo, useCallback, useState, useEffect } from "react";

// Layout comprises of:
// 1. Theme Dropdown
// 2. Listed conversation links
// 3. Sidebar as wrapper of all of these

const ThemeDropdown = function ThemeDropdown() {
    const { setTheme } = useTheme();

    return (
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
    );
};

function ConversationList({ conversations }: { conversations: { id: string; title: string }[] }) {
    if (!conversations.length) {
        return (
            <div className="flex flex-col w-full h-full items-center justify-center gap-2 text-sm opacity-50 [&>svg]:size-4 [&>svg]:shrink-0">
                <span>Past convos will show here</span>
                <FileClock />
            </div>
        )
    } else return (
        <>
            {conversations.map(convo =>
                <SidebarMenuButton asChild key={convo.id}>
                    <Link href={`/chat?id=${convo.id}`}>
                        {convo.title}
                    </Link>
                </SidebarMenuButton>
            )}
        </>
    )
};
  
export function AppSidebar() {
    const conversations = useConvoStore(state => state.convoIds);

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
                <ConversationList conversations={conversations} />
            </SidebarContent>

            <SidebarSeparator />
            
            <SidebarFooter>
                <SidebarMenuButton asChild>
                    <Link href="/history">
                        All Past Conversations <FileClock className="ml-auto" />
                    </Link>
                </SidebarMenuButton>
                <ThemeDropdown />
            </SidebarFooter>
        </Sidebar>
    )
};
  