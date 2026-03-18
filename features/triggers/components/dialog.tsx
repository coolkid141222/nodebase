"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/dialog"
import { Button } from "@/components/button"
import { PlayIcon } from "lucide-react"

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onTrigger?: () => void;
    disabled?: boolean;
}

export const ManualTriggerDialog = ({
    open,
    onOpenChange,
    onTrigger,
    disabled,
}: Props) => {
    const handleTrigger = () => {
        onTrigger?.();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <PlayIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <DialogTitle>手动触发工作流</DialogTitle>
                        </div>
                    </div>
                    <DialogDescription className="pt-2">
                        确认要手动执行此工作流吗？此操作将立即启动工作流运行。
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:justify-end">
                    <Button
                        variant="default"
                        onClick={handleTrigger}
                        disabled={disabled}
                    >
                        <PlayIcon className="mr-2 h-4 w-4" />
                        立即触发
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
