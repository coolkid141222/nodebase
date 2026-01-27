"use client"

import { PlusIcon } from "lucide-react"
import { memo, useState } from "react"
import { Button } from "@/components/button"

export const AddNodeButton = memo(() => {
    return (
        <Button
            onClick={() => {}}
            size="icon"
            variant="outline"
            className="bg-background"
        >
            <PlusIcon className="size-4" />
        </Button>
    )
})

AddNodeButton.displayName = "AddNodeButton"