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
import { LanguageToggle } from "@/features/i18n/components/language-toggle";
import { useI18n } from "@/features/i18n/provider";

export const AppSidebar = () => {
    const { t } = useI18n();
    const pathname = usePathname()
    const router = useRouter();
    const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
    const billingState = useBillingState();
    const workflowMatch = pathname.match(/^\/workflows\/([^/]+)$/);
    const workflowId = workflowMatch?.[1] ?? "";
    const showWorkflowPreview = Boolean(workflowId && workflowId !== "new");
    const activePlan = billingState.data?.plan ?? BillingPlan.FREE;
    const upgradeLabel =
        activePlan === BillingPlan.PRO
            ? t("sidebar.manageProPlan")
            : t("sidebar.upgradeToPro");
    const menuItems = [
        {
            title: "main",
            items: [
                {
                    title: t("sidebar.workflows"),
                    icon: FolderOpen,
                    url: "/workflows",
                },
                {
                    title: t("sidebar.credentials"),
                    icon: KeyIcon,
                    url: "/credentials",
                },
                {
                    title: t("sidebar.executions"),
                    icon: HistoryIcon,
                    url: "/executions",
                },
            ]
        },
    ];
    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild className="gap-x-4 h-10">
                        <Link href={"/"} prefetch>
                            <Image src={"/logo.svg"} alt="nodebase" width={30} height={30} />
                            <span className="font-semibold text-md">{t("sidebar.brand")}</span>
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
                    <SidebarMenuItem className="group-data-[collapsible=icon]:hidden px-2 pb-1">
                        <LanguageToggle compact />
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            tooltip={t("sidebar.upgradeToPro")}
                            className="gap-x-4 h-10 px-4"
                            onClick={() => setIsUpgradeOpen(true)}
                        >
                            <StarsIcon className="h-4 w-4" />
                            <span>{upgradeLabel}</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            tooltip={t("sidebar.billingPortal")}
                            className="gap-x-4 h-10 px-4"
                            asChild
                        >
                            <Link href="/billing" prefetch>
                                <CreditCardIcon className="h-4 w-4" />
                                <span>{t("sidebar.billingPortal")}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            tooltip={t("common.signOut")}
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
                            <span>{t("common.signOut")}</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <UpgradeModal open={isUpgradeOpen} onOpenChange={setIsUpgradeOpen} />
        </Sidebar>
    )
}
