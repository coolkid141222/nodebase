"use client"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarSeparator,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/sidebar"
import { FolderOpen, HistoryIcon, KeyIcon, StarsIcon, LogOutIcon, CreditCardIcon, BotIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { WorkflowRunPreviewSidebar } from "@/features/executions/components/workflow-run-preview"

const menuItems = [
    {
        title: "Main",
        items: [
            {
                title: "workflows",
                icon: FolderOpen,
                url: "/workflows",
            },
            {
                title: "Credentials",
                icon: KeyIcon,
                url: "/credentials",
            },
            {
                title: "executions",
                icon: HistoryIcon,
                url: "/executions",
            },
            {
                title: "AI Test",
                icon: BotIcon,
                url: "/ai-test",
            }
        ]
    },
]

export const AppSidebar = () => {
    const pathname = usePathname()
    const router = useRouter();
    const workflowMatch = pathname.match(/^\/workflows\/([^/]+)$/);
    const workflowId = workflowMatch?.[1] ?? "";
    const showWorkflowPreview = Boolean(workflowId && workflowId !== "new");
    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild className="gap-x-4 h-10">
                        <Link href={"/"} prefetch>
                            <Image src={"/logo.svg"} alt="nodebase" width={30} height={30} />
                            <span className="font-semibold text-md">Nodebase</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarHeader>
            <SidebarContent>
                {menuItems.map((group) => (
                    <SidebarGroup key={group.title}>
                        <SidebarMenu>
                            {group.items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        tooltip={item.title}
                                        isActive={
                                            item.url === "/"
                                                ? pathname === "/"
                                                : pathname.startsWith(item.url)
                                        }
                                        asChild
                                        className="gap-x-4 h-10 px-4"
                                    >
                                        <Link href={item.url} prefetch>
                                            <item.icon className="size-4" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroup>
                ))}
                {showWorkflowPreview && (
                    <>
                        <SidebarSeparator />
                        <SidebarGroup className="gap-2">
                            <SidebarGroupLabel>Latest run</SidebarGroupLabel>
                            <SidebarGroupContent className="px-2 pb-2">
                                <WorkflowRunPreviewSidebar
                                    workflowId={workflowId}
                                />
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </>
                )}
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            tooltip="Upgrade to Pro"
                            className="gap-x-4 h-10 px-4"
                            onClick={() => { }}
                        >
                            <StarsIcon className="h-4 w-4" />
                            <span>Upgrade to Pro</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            tooltip="Billing Portal"
                            className="gap-x-4 h-10 px-4"
                            onClick={() => { }}
                        >
                            <CreditCardIcon className="h-4 w-4" />
                            <span>Billing Portal</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            tooltip="Sign out"
                            className="gap-x-4 h-10 px-4"
                            onClick={() => authClient.signOut({
                                fetchOptions: {
                                    onSuccess: () => {
                                        router.push("/login");
                                    }
                                }
                            })}
                        >
                            <LogOutIcon className="h-4 w-4" />
                            <span>Sign out</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
