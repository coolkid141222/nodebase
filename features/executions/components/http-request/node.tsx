"use client"

import type { NodeProps } from "@xyflow/react"
import { GlobeIcon } from "lucide-react"
import { memo } from "react"
import { BaseExcutionNode } from "@/components/base-execution-node"

type HttpRequestNodeData = {
    endpoint?: string;
    method?: "GET" | "POST" | "PATCH" | "DELETE"
    body: string;
    [key: string]: unknown;
}

export const HttpRequestNode = memo((props: NodeProps) => {
    const nodeData = props.data as HttpRequestNodeData
    const description = nodeData?.endpoint
        ? `${nodeData.method || "GET"} : ${nodeData.endpoint}`
        : "Not configured"

    return (
        <>
            <BaseExcutionNode
                {...props}
                icon={GlobeIcon}
                name="HTTP Request"
                description={description}
                onSetting={() => {}}
                onDoubleClick={() => {}}
            />
        </>
    )
})

HttpRequestNode.displayName = "HttpRequestNode"