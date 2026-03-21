"use client"

import type { NodeProps } from "@xyflow/react"
import { GlobeIcon } from "lucide-react"
import { memo, useState } from "react"
import { useReactFlow } from "@xyflow/react"
import { BaseExcutionNode } from "@/components/base-execution-node"
import { HttpRequestDialog } from "./dialog"
import { FormType } from "./dialog"
import type { HttpRequestNodeData } from "../../http-request/shared"
import { useWorkflowNodeStatus } from "../workflow-execution-status-context"

export const HttpRequestNode = memo((props: NodeProps) => {
    const { setNodes } = useReactFlow()
    const nodeData = props.data as HttpRequestNodeData
    const nodeStatus = useWorkflowNodeStatus(props.id)
    const description = nodeData?.endpoint
        ? `${nodeData.method || "GET"} : ${nodeData.endpoint}${nodeData.credentialId ? " · credential" : ""}`
        : "Not configured"
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
                              credentialId: values.credentialId && values.credentialId !== "none"
                                  ? values.credentialId
                                  : undefined,
                              credentialField: values.credentialId && values.credentialId !== "none"
                                  ? values.credentialField?.trim() || undefined
                                  : undefined,
                              authType: values.credentialId && values.credentialId !== "none"
                                  ? values.authType
                                  : undefined,
                              headerName: values.credentialId && values.credentialId !== "none" && values.authType === "HEADER"
                                  ? values.headerName?.trim() || undefined
                                  : undefined,
                              memoryWrites: values.memoryWrites,
                          },
                      }
                    : node
            )
        )
        setDialogOpen(false)
    }

    return (
        <>
            {dialogOpen && (
                <HttpRequestDialog
                    open={dialogOpen}
                    onOpenChange={setDialogOpen}
                    onSubmit={handleSubmit}
                    defaultEndpoint={nodeData.endpoint}
                    defaultMethod={nodeData.method}
                    defaultBody={nodeData.body}
                    defaultCredentialId={nodeData.credentialId}
                defaultCredentialField={nodeData.credentialField}
                defaultAuthType={nodeData.authType}
                defaultHeaderName={nodeData.headerName}
                defaultMemoryWrites={nodeData.memoryWrites}
            />
            )}
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
