"use client"
import { createId } from "@paralleldrive/cuid2"
import { useReactFlow } from "@xyflow/react"
import {
    BotIcon,
    GlobeIcon,
    MessageSquareIcon,
    LinkIcon,
    MousePointerIcon
} from "lucide-react"
import { useCallback } from "react"
import { toast } from "sonner"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/sheet"
import { NodeType } from "@/types/workflow"

export type NodeTypeOptions = {
    type: NodeType;
    label: string;
    decription: string;
    icon: React.ComponentType<{ className?: string}> | string;
}

const triggerNodes: NodeTypeOptions[] = [
    {
        type: "MANUAL_TRIGGER",
        label: "MANUAL TRIGGER",
        decription: "Start the workflow manually",
        icon: MousePointerIcon
    },
    {
        type: "WEBHOOK_TRIGGER",
        label: "WEBHOOK TRIGGER",
        decription: "Start the workflow from an HTTP request",
        icon: LinkIcon
    }
]

const executionNodes: NodeTypeOptions[] = [
    {
        type: "HTTP_REQUEST",
        label: "HTTP REQUEST",
        decription: "Make an HTTP request",
        icon: GlobeIcon
    },
    {
        type: "AI_TEXT",
        label: "AI TEXT",
        decription: "Generate text with an AI provider",
        icon: BotIcon
    },
    {
        type: "DISCORD_MESSAGE",
        label: "DISCORD MESSAGE",
        decription: "Post a message to Discord",
        icon: MessageSquareIcon
    },
    {
        type: "SLACK_MESSAGE",
        label: "SLACK MESSAGE",
        decription: "Post a message to Slack",
        icon: MessageSquareIcon
    }
]

interface NodeSelectorProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
}

export function NodeSelector({
    open,
    onOpenChange,
    children
}: NodeSelectorProps) {
    const { setNodes, getNodes, screenToFlowPosition } = useReactFlow();
    const handleNodeSelect = useCallback((selection: NodeTypeOptions) => {
        if (selection.type === "MANUAL_TRIGGER" || selection.type === "WEBHOOK_TRIGGER") {
            const nodes = getNodes();
            const hasTriggerNode = nodes.some(
                (node) => node.type === "MANUAL_TRIGGER" || node.type === "WEBHOOK_TRIGGER",
            )
            if (hasTriggerNode) {
                toast.error("Only one trigger is allowed per workflow")
                return
            }
        }
        setNodes((nodes) => {
            const hasInitialTrigger = nodes.some(
                (node) => node.type === "INITIAL"
            )
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            const flowPosition = screenToFlowPosition({
                x: centerX + (Math.random() - 0.5) * 200,
                y: centerY + (Math.random() - 0.5) * 200
            })

            const newNode = {
                id: createId(),
                data: {},
                position: flowPosition,
                type: selection.type,
            }

            if (hasInitialTrigger) {
                return [newNode]
            }

            return [...nodes, newNode]
        })
        onOpenChange(false);
    }, [
        setNodes,
        getNodes,
        onOpenChange,
        screenToFlowPosition
    ])

    return(
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>
                        What trigger this workflow?
                    </SheetTitle>
                    <SheetDescription>
                        A trigger is a step that starts your workflow
                    </SheetDescription>

                </SheetHeader>
                    <div>
                        {triggerNodes.map((NodeType) => {
                            const Icon = NodeType.icon
                            return (
                                <div
                                    key={NodeType.type}
                                    className="w-full justify-start h-auto py-5 px-4
                                    rounded-none  cursor-pointer border-l-2 border-transparent hover:border-l-primary"
                                    onClick={() => handleNodeSelect(NodeType)}
                                >
                                    <div className="flex items-center gap-6 w-full overflow-hidden">
                                        {typeof Icon === "string" ? (
                                            <img
                                                src={Icon}
                                                alt={NodeType.label}
                                                className="size-5 object-contain rounded-sm"
                                            />
                                            ) : (
                                                <Icon className="size-5"/>
                                            )
                                        }
                                        <div className="flex flex-col items-start text-left">
                                            <span className="font-medium text-sm">
                                                {NodeType.label}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {NodeType.decription}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div>
                        {executionNodes.map((NodeType) => {
                            const Icon = NodeType.icon
                            return (
                                <div
                                    key={NodeType.type}
                                    className="w-full justify-start h-auto py-5 px-4
                                    rounded-none  cursor-pointer border-l-2 border-transparent hover:border-l-primary"
                                    onClick={() => handleNodeSelect(NodeType)}
                                >
                                    <div className="flex items-center gap-6 w-full overflow-hidden">
                                        {typeof Icon === "string" ? (
                                            <img
                                                src={Icon}
                                                alt={NodeType.label}
                                                className="size-5 object-contain rounded-sm"
                                            />
                                            ) : (
                                                <Icon className="size-5"/>
                                            )
                                        }
                                        <div className="flex flex-col items-start text-left">
                                            <span className="font-medium text-sm">
                                                {NodeType.label}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {NodeType.decription}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
            </SheetContent>
        </Sheet>

    )
}
