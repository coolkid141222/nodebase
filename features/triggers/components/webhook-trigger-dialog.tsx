"use client";

import { ClipboardCopyIcon, LinkIcon } from "lucide-react";
import { Button } from "@/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/dialog";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workflowId: string;
};

export const WebhookTriggerDialog = ({
  open,
  onOpenChange,
  workflowId,
}: Props) => {
  const endpointPath = `/api/webhooks/${workflowId}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(
      `${window.location.origin}${endpointPath}`,
    );
    toast.success("Webhook URL copied");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <LinkIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Webhook Trigger</DialogTitle>
              <DialogDescription className="pt-2">
                Send a POST request to this endpoint to start the workflow.
                The request body becomes the workflow trigger payload.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3">
          <div className="rounded-lg border bg-muted/30 p-3 font-mono text-xs break-all">
            {endpointPath}
          </div>
          <div className="text-sm text-muted-foreground">
            Example payload:
            <pre className="mt-2 overflow-x-auto rounded-md border bg-background p-3 text-xs">
{`{
  "source": "webhook",
  "body": { "message": "hello" }
}`}
            </pre>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:justify-end">
          <Button variant="outline" onClick={handleCopy}>
            <ClipboardCopyIcon className="size-4" />
            Copy URL
          </Button>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
