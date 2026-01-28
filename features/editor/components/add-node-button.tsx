"use client"

import { PlusIcon } from "lucide-react"
import { memo, useState } from "react"
import { Button } from "@/components/button"
import { NodeSelector } from "@/components/node-selector"

export const AddNodeButton = memo(() => {
    const [selectorOpen, setSelectorOpen] = useState(false);


    return (
        <NodeSelector open={selectorOpen} onOpenChange={setSelectorOpen}>
            <Button
                onClick={() => {}}
                size="icon"
                variant="outline"
                className="bg-background"
                >
                <PlusIcon className="size-4" />
            </Button>
        </NodeSelector>
    )
})

AddNodeButton.displayName = "AddNodeButton"