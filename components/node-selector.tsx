"use client";

import { createId } from "@paralleldrive/cuid2";
import { useReactFlow } from "@xyflow/react";
import {
  BotIcon,
  GlobeIcon,
  MessageSquareIcon,
  LinkIcon,
  MousePointerIcon,
  RotateCwIcon,
  WrenchIcon,
} from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/sheet";
import { Input } from "@/components/input";
import { Badge } from "@/components/badge";
import { NodeType } from "@/types/workflow";
import { cn } from "@/lib/utils";

export type NodeTypeOptions = {
  type: NodeType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: "trigger" | "action" | "messaging";
};

const triggerNodes: NodeTypeOptions[] = [
  {
    type: "MANUAL_TRIGGER",
    label: "Manual Trigger",
    description: "Start the workflow manually",
    icon: MousePointerIcon,
    category: "trigger",
  },
  {
    type: "WEBHOOK_TRIGGER",
    label: "Webhook Trigger",
    description: "Start from an HTTP request",
    icon: LinkIcon,
    category: "trigger",
  },
];

const actionNodes: NodeTypeOptions[] = [
  {
    type: "HTTP_REQUEST",
    label: "HTTP Request",
    description: "Make an HTTP request",
    icon: GlobeIcon,
    category: "action",
  },
  {
    type: "AI_TEXT",
    label: "AI Text",
    description: "Generate text with AI",
    icon: BotIcon,
    category: "action",
  },
  {
    type: "LOOP",
    label: "Loop",
    description: "Repeat a cycle",
    icon: RotateCwIcon,
    category: "action",
  },
  {
    type: "TOOL",
    label: "Tool",
    description: "Call internal/MCP tool",
    icon: WrenchIcon,
    category: "action",
  },
];

const messagingNodes: NodeTypeOptions[] = [
  {
    type: "DISCORD_MESSAGE",
    label: "Discord",
    description: "Send to Discord",
    icon: MessageSquareIcon,
    category: "messaging",
  },
  {
    type: "SLACK_MESSAGE",
    label: "Slack",
    description: "Send to Slack",
    icon: MessageSquareIcon,
    category: "messaging",
  },
];

interface NodeSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function NodeSelector({
  open,
  onOpenChange,
  children,
}: NodeSelectorProps) {
  const { setNodes, getNodes, screenToFlowPosition } = useReactFlow();
  const [search, setSearch] = useState("");

  const allNodes = [...triggerNodes, ...actionNodes, ...messagingNodes];
  const filteredNodes = search
    ? allNodes.filter(
        (node) =>
          node.label.toLowerCase().includes(search.toLowerCase()) ||
          node.description.toLowerCase().includes(search.toLowerCase()),
      )
    : allNodes;

  const handleDragStart = useCallback(
    (event: React.DragEvent, nodeType: NodeTypeOptions) => {
      event.dataTransfer.setData("application/reactflow", nodeType.type);
      event.dataTransfer.effectAllowed = "move";
    },
    [],
  );

  const handleDragEnd = useCallback(
    (event: React.DragEvent, nodeType: NodeTypeOptions) => {
      event.preventDefault();

      if (nodeType.type === "MANUAL_TRIGGER" || nodeType.type === "WEBHOOK_TRIGGER") {
        const nodes = getNodes();
        const hasTriggerNode = nodes.some(
          (node) =>
            node.type === "MANUAL_TRIGGER" || node.type === "WEBHOOK_TRIGGER",
        );
        if (hasTriggerNode) {
          toast.error("Only one trigger is allowed per workflow");
          return;
        }
      }

      const project = (event: React.DragEvent) => {
        const reactFlowBounds = document
          .querySelector(".react-flow")
          ?.getBoundingClientRect();
        if (!reactFlowBounds) {
          return { x: 0, y: 0 };
        }

        return screenToFlowPosition({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });
      };

      setNodes((nodes) => {
        const hasInitialTrigger = nodes.some((node) => node.type === "INITIAL");
        const position = project(event);

        const newNode = {
          id: createId(),
          data: {},
          position,
          type: nodeType.type,
        };

        if (hasInitialTrigger) {
          return [newNode];
        }

        return [...nodes, newNode];
      });

      onOpenChange(false);
    },
    [getNodes, screenToFlowPosition, setNodes, onOpenChange],
  );

  const renderNodeItem = (nodeType: NodeTypeOptions, isDragging = false) => {
    const Icon = nodeType.icon;
    return (
      <div
        key={nodeType.type}
        draggable
        onDragStart={(e) => handleDragStart(e, nodeType)}
        onDragEnd={(e) => handleDragEnd(e, nodeType)}
        className={cn(
          "flex cursor-grab items-center gap-3 rounded-lg border p-3 transition-all",
          "hover:border-primary hover:bg-muted/50",
          isDragging && "opacity-50",
        )}
      >
        {typeof Icon === "string" ? (
          <img
            src={Icon}
            alt={nodeType.label}
            className="size-5 object-contain rounded-sm"
          />
        ) : (
          <Icon className="size-5 text-muted-foreground" />
        )}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium">{nodeType.label}</div>
          <div className="text-xs text-muted-foreground truncate">
            {nodeType.description}
          </div>
        </div>
        <Badge variant="outline" className="text-[10px] shrink-0">
          Drag
        </Badge>
      </div>
    );
  };

  const categories = [
    { key: "trigger", label: "Triggers", nodes: triggerNodes },
    { key: "action", label: "Actions", nodes: actionNodes },
    { key: "messaging", label: "Messaging", nodes: messagingNodes },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add Node</SheetTitle>
          <SheetDescription>
            Drag a node to the canvas or click to add
          </SheetDescription>
        </SheetHeader>

        {/* Search */}
        <div className="relative py-3">
          <Input
            placeholder="Search nodes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Drag Hint */}
        <div className="mb-4 rounded-lg bg-primary/10 p-3">
          <p className="text-xs text-primary">
            <strong>Tip:</strong> Drag and drop nodes directly onto the canvas
          </p>
        </div>

        {/* Node Categories */}
        {search ? (
          <div className="space-y-3">
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Search Results ({filteredNodes.length})
            </div>
            <div className="space-y-2">
              {filteredNodes.map((node) => renderNodeItem(node))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {categories.map(({ key, label, nodes }) => (
              <div key={key}>
                <div className="mb-3 flex items-center gap-2">
                  <Badge variant="secondary">{label}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {nodes.length} nodes
                  </span>
                </div>
                <div className="space-y-2">{nodes.map((node) => renderNodeItem(node))}</div>
              </div>
            ))}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
