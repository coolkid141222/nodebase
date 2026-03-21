import { SidebarInset, SidebarProvider } from "@/components/sidebar";
import { AppSidebar } from "../components/app-sidebar";
import { WorkflowExecutionStatusScope } from "@/features/executions/components/workflow-execution-status-context";

export const runtime = "nodejs";

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <SidebarProvider defaultOpen={true}>
            <WorkflowExecutionStatusScope>
                <AppSidebar />
                <SidebarInset className="bg-accent/20">
                    {children}
                </SidebarInset>
            </WorkflowExecutionStatusScope>
        </SidebarProvider>
    )
}

export default Layout;
