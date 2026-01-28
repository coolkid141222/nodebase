"use client"

import type { NodeProps } from "@xyflow/react"
import { GlobeIcon } from "lucide-react"
import { memo, useState } from "react"
import { useReactFlow } from "@xyflow/react"
import { BaseExcutionNode } from "@/components/base-execution-node"
import { HttpRequestDialog } from "./dialog"
import { FormType } from "./dialog"

type HttpRequestNodeData = {
    endpoint?: string;
    method?: "GET" | "POST" | "PATCH" | "DELETE"
    body: string;
    [key: string]: unknown;
}

export const HttpRequestNode = memo((props: NodeProps) => {
    const { setNodes } = useReactFlow()
    const nodeData = props.data as HttpRequestNodeData
    const description = nodeData?.endpoint
        ? `${nodeData.method || "GET"} : ${nodeData.endpoint}`
        : "Not configured"

    const nodeStatus = "success"
    const [dialogOpen, setDialogOpen] = useState(false);
    const handleOpenSettings = () => setDialogOpen(true);

    const handleSubmit = (values: FormType) => {
        setNodes((nodes) =>
            nodes.map((node) =>
                node.id === props.id
                    ? {
                          ...node,
                          data: {
                              ...node.data,
                              endpoint: values.endpoint,
                              method: values.method,
                              body: values.body || "",
                          },
                      }
                    : node
            )
        )
        setDialogOpen(false)
    }

    return (
        <>
            <HttpRequestDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onSubmit={handleSubmit}
                defaultEndpoint={nodeData.endpoint}
                defaultMethod={nodeData.method}
                defaultBody={nodeData.body}
            />
            <BaseExcutionNode
                {...props}
                icon={GlobeIcon}
                name="HTTP Request"
                status={nodeStatus}
                description={description}
                onSetting={handleOpenSettings}
            />
        </>
    )
})

HttpRequestNode.displayName = "HttpRequestNode"