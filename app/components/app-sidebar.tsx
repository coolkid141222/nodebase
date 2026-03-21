"use client"

import { useState } from "react";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarSeparator,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/sidebar"
import { FolderOpen, HistoryIcon, KeyIcon, StarsIcon, LogOutIcon, CreditCardIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { WorkflowRunPreviewSidebar } from "@/features/executions/components/workflow-run-preview"
import { UpgradeModal } from "@/app/components/upgrade-modal";
import { useBillingState } from "@/features/billing/hooks/use-billing";
import { BillingPlan } from "@/lib/prisma/client";

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
        ]
    },
]

export const AppSidebar = () => {
    const pathname = usePathname()
    const router = useRouter();
    const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
    const billingState = useBillingState();
    const workflowMatch = pathname.match(/^\/workflows\/([^/]+)$/);
    const workflowId = workflowMatch?.[1] ?? "";
    const showWorkflowPreview = Boolean(workflowId && workflowId !== "new");
    const activePlan = billingState.data?.plan ?? BillingPlan.FREE;
    const upgradeLabel =
        activePlan === BillingPlan.PRO ? "Manage Pro plan" : "Upgrade to Pro";
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
            <SidebarContent className={showWorkflowPreview ? "overflow-hidden" : undefined}>
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
                        <SidebarGroup className="min-w-0 min-h-0 flex-1 gap-2 group-data-[collapsible=icon]:hidden">
                                <SidebarGroupContent className="min-w-0 min-h-0 flex-1 px-2 pb-2 overflow-hidden">
                                <WorkflowRunPreviewSidebar />
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
                            onClick={() => setIsUpgradeOpen(true)}
                        >
                            <StarsIcon className="h-4 w-4" />
                            <span>{upgradeLabel}</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            tooltip="Billing Portal"
                            className="gap-x-4 h-10 px-4"
                            asChild
                        >
                            <Link href="/billing" prefetch>
                                <CreditCardIcon className="h-4 w-4" />
                                <span>Billing Portal</span>
                            </Link>
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
            <UpgradeModal open={isUpgradeOpen} onOpenChange={setIsUpgradeOpen} />
        </Sidebar>
    )
}
