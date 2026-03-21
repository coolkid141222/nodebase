"use client";

import { useEffect, useMemo } from "react";
import { ClipboardCopyIcon, LinkIcon, PlusIcon, SaveIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import z from "zod";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/field";
import { Input } from "@/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/select";
import { Textarea } from "@/components/textarea";
import { toast } from "sonner";
import {
  createDefaultExecutionMemoryWriteConfig,
  type ExecutionMemoryWriteConfig,
} from "@/features/executions/memory/shared";
import { triggerNodeSchema } from "../shared";
import { TemplateVariablePicker } from "@/features/executions/components/template-variable-picker";
import type { TemplateVariableOption } from "@/features/executions/components/template-variables";

const EMPTY_MEMORY_WRITES: ExecutionMemoryWriteConfig[] = [];

export type WebhookTriggerFormValues = z.output<typeof triggerNodeSchema>;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workflowId: string;
  webhookSecret: string;
  onSave?: (values: WebhookTriggerFormValues) => Promise<void> | void;
  defaultMemoryWrites?: ExecutionMemoryWriteConfig[];
  templateVariables?: TemplateVariableOption[];
};

export const WebhookTriggerDialog = ({
  open,
  onOpenChange,
  workflowId,
  webhookSecret,
  onSave,
  defaultMemoryWrites,
  templateVariables = [],
}: Props) => {
  const endpointPath = `/api/webhooks/${workflowId}?token=${webhookSecret}`;
  const initialMemoryWritesKey = JSON.stringify(
    defaultMemoryWrites ?? EMPTY_MEMORY_WRITES,
  );
  const initialMemoryWrites = useMemo(
    () =>
      JSON.parse(initialMemoryWritesKey) as ExecutionMemoryWriteConfig[],
    [initialMemoryWritesKey],
  );
  const form = useForm<
    z.input<typeof triggerNodeSchema>,
    unknown,
    WebhookTriggerFormValues
  >({
    resolver: zodResolver(triggerNodeSchema),
    defaultValues: {
      memoryWrites: initialMemoryWrites,
    },
  });
  const {
    fields: memoryWriteFields,
    append: appendMemoryWrite,
    remove: removeMemoryWrite,
  } = useFieldArray({
    control: form.control,
    name: "memoryWrites",
  });

  useEffect(() => {
    form.reset({
      memoryWrites: initialMemoryWrites,
    });
  }, [form, initialMemoryWrites]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(
      `${window.location.origin}${endpointPath}`,
    );
    toast.success("Webhook URL copied");
  };

  const handleSave = async (values: WebhookTriggerFormValues) => {
    await onSave?.(values);
    toast.success("Webhook trigger settings saved");
    onOpenChange(false);
  };

  const insertMemoryWriteTemplate = (index: number, template: string) => {
    const field = `memoryWrites.${index}.value` as const;
    const currentValue = form.getValues(field) ?? "";
    const nextValue = currentValue.trim()
      ? `${currentValue}\n${template}`
      : template;

    form.setValue(field, nextValue, {
      shouldDirty: true,
      shouldValidate: true,
    });
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

        <form
          onSubmit={form.handleSubmit((values) => void handleSave(values))}
          className="space-y-4"
        >
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
        <FieldGroup className="rounded-xl border border-border/70 bg-muted/20 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <FieldLabel>Write to memory</FieldLabel>
              <FieldDescription>
                Persist selected values from the webhook payload into execution memory.
                Useful templates: <code>{"{{current.output.body}}"}</code>,{" "}
                <code>{"{{trigger.body}}"}</code>,{" "}
                <code>{"{{execution.id}}"}</code>.
              </FieldDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendMemoryWrite(createDefaultExecutionMemoryWriteConfig())}
            >
              <PlusIcon className="size-4" />
              Add
            </Button>
          </div>

          <div className="space-y-4">
            {memoryWriteFields.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No custom memory writes yet.
              </p>
            ) : (
              memoryWriteFields.map((field, index) => (
                <div
                  key={field.id}
                  className="space-y-3 rounded-lg border border-border/70 bg-background p-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-medium text-foreground">
                      Memory write {index + 1}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMemoryWrite(index)}
                    >
                      <Trash2Icon className="size-4" />
                      Remove
                    </Button>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <FieldGroup>
                      <FieldLabel>Scope</FieldLabel>
                      <Select
                        defaultValue={field.scope}
                        onValueChange={(value: "SHARED" | "NODE") =>
                          form.setValue(`memoryWrites.${index}.scope`, value, {
                            shouldDirty: true,
                            shouldValidate: true,
                          })
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select scope" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SHARED">Shared</SelectItem>
                          <SelectItem value="NODE">Node private</SelectItem>
                        </SelectContent>
                      </Select>
                    </FieldGroup>

                    <FieldGroup>
                      <FieldLabel>Mode</FieldLabel>
                      <Select
                        defaultValue={field.mode}
                        onValueChange={(value: "REPLACE" | "MERGE" | "APPEND") =>
                          form.setValue(`memoryWrites.${index}.mode`, value, {
                            shouldDirty: true,
                            shouldValidate: true,
                          })
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select mode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="REPLACE">Replace</SelectItem>
                          <SelectItem value="MERGE">Merge</SelectItem>
                          <SelectItem value="APPEND">Append</SelectItem>
                        </SelectContent>
                      </Select>
                    </FieldGroup>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <FieldGroup>
                      <FieldLabel>Namespace</FieldLabel>
                      <Field>
                        <Input
                          {...form.register(`memoryWrites.${index}.namespace`)}
                          placeholder="results"
                        />
                      </Field>
                      <FieldError
                        errors={[form.formState.errors.memoryWrites?.[index]?.namespace]}
                      />
                    </FieldGroup>

                    <FieldGroup>
                      <FieldLabel>Key</FieldLabel>
                      <Field>
                        <Input
                          {...form.register(`memoryWrites.${index}.key`)}
                          placeholder="payload"
                        />
                      </Field>
                      <FieldError
                        errors={[form.formState.errors.memoryWrites?.[index]?.key]}
                      />
                    </FieldGroup>
                  </div>

                  <FieldGroup>
                    <div className="flex items-center justify-between gap-3">
                      <FieldLabel>Value template</FieldLabel>
                      <TemplateVariablePicker
                        options={templateVariables}
                        onSelect={(value) => insertMemoryWriteTemplate(index, value)}
                        label="Insert"
                      />
                    </div>
                    <Field>
                      <Textarea
                        rows={3}
                        className="resize-none"
                        {...form.register(`memoryWrites.${index}.value`)}
                        placeholder='{{current.output.body}}'
                      />
                    </Field>
                    <FieldError
                      errors={[form.formState.errors.memoryWrites?.[index]?.value]}
                    />
                  </FieldGroup>

                  <FieldGroup>
                    <FieldLabel>Visibility</FieldLabel>
                    <Select
                      defaultValue={field.visibility}
                      onValueChange={(value: "PUBLIC" | "PRIVATE") =>
                        form.setValue(`memoryWrites.${index}.visibility`, value, {
                          shouldDirty: true,
                          shouldValidate: true,
                        })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select visibility" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PUBLIC">Public</SelectItem>
                        <SelectItem value="PRIVATE">Private</SelectItem>
                      </SelectContent>
                    </Select>
                  </FieldGroup>
                </div>
              ))
            )}
          </div>
        </FieldGroup>

        <DialogFooter className="gap-2 sm:justify-end">
          <Button variant="outline" onClick={handleCopy}>
            <ClipboardCopyIcon className="size-4" />
            Copy URL
          </Button>
          <Button type="submit">
            <SaveIcon className="size-4" />
            Save
          </Button>
        </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
