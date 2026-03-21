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
import { useI18n } from "@/features/i18n/provider";

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
  const { t } = useI18n();
  const endpointPath = `/api/webhooks/${workflowId}?token=${webhookSecret}`;
  const feishuEndpointPath = `/api/feishu/${workflowId}?token=${webhookSecret}`;
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

  const handleCopy = async (path: string, successKey: string) => {
    await navigator.clipboard.writeText(`${window.location.origin}${path}`);
    toast.success(t(successKey));
  };

  const handleSave = async (values: WebhookTriggerFormValues) => {
    await onSave?.(values);
    toast.success(t("dialog.trigger.settingsSaved"));
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
              <DialogTitle>{t("dialog.trigger.webhookTitle")}</DialogTitle>
              <DialogDescription className="pt-2">
                {t("dialog.trigger.webhookDescription")}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit((values) => void handleSave(values))}
          className="space-y-4"
        >
        <div className="space-y-3">
          <div className="space-y-3 rounded-xl border border-border/70 bg-muted/20 p-4">
            <div className="space-y-1">
              <FieldLabel>{t("dialog.trigger.webhookTitle")}</FieldLabel>
              <FieldDescription>
                {t("dialog.trigger.webhookDescription")}
              </FieldDescription>
            </div>
            <div className="rounded-lg border bg-muted/30 p-3 font-mono text-xs break-all">
              {endpointPath}
            </div>
            <div className="text-sm text-muted-foreground">
              {t("dialog.trigger.examplePayload")}
              <pre className="mt-2 overflow-x-auto rounded-md border bg-background p-3 text-xs">
{`{
  "source": "webhook",
  "body": { "message": "hello" }
}`}
              </pre>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void handleCopy(endpointPath, "dialog.trigger.webhookCopied")}
            >
              <ClipboardCopyIcon className="size-4" />
              {t("common.copyUrl")}
            </Button>
          </div>

          <div className="space-y-3 rounded-xl border border-border/70 bg-muted/20 p-4">
            <div className="space-y-1">
              <FieldLabel>{t("dialog.trigger.feishuTitle")}</FieldLabel>
              <FieldDescription>
                {t("dialog.trigger.feishuDescription")}
              </FieldDescription>
            </div>
            <div className="rounded-lg border bg-muted/30 p-3 font-mono text-xs break-all">
              {feishuEndpointPath}
            </div>
            <div className="text-sm text-muted-foreground">
              {t("dialog.trigger.feishuInstructions")}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void handleCopy(feishuEndpointPath, "dialog.trigger.feishuCopied")}
            >
              <ClipboardCopyIcon className="size-4" />
              {t("common.copyUrl")}
            </Button>
          </div>
        </div>
        <FieldGroup className="rounded-xl border border-border/70 bg-muted/20 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <FieldLabel>{t("dialog.ai.writeMemory")}</FieldLabel>
              <FieldDescription>
                {t("dialog.trigger.writeMemoryDescription")} <code>{"{{current.output.body}}"}</code>,{" "}
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
              {t("common.add")}
            </Button>
          </div>

          <div className="space-y-4">
            {memoryWriteFields.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {t("common.noCustomMemoryWrites")}
              </p>
            ) : (
              memoryWriteFields.map((field, index) => (
                <div
                  key={field.id}
                  className="space-y-3 rounded-lg border border-border/70 bg-background p-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-medium text-foreground">
                      {t("common.memoryWrite", { count: index + 1 })}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMemoryWrite(index)}
                    >
                      <Trash2Icon className="size-4" />
                      {t("common.remove")}
                    </Button>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <FieldGroup>
                      <FieldLabel>{t("common.scopeLabel")}</FieldLabel>
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
                          <SelectValue placeholder={t("common.selectScope")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SHARED">{t("common.shared")}</SelectItem>
                          <SelectItem value="NODE">{t("common.nodePrivate")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </FieldGroup>

                    <FieldGroup>
                      <FieldLabel>{t("common.modeLabel")}</FieldLabel>
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
                          <SelectValue placeholder={t("common.selectMode")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="REPLACE">{t("common.replace")}</SelectItem>
                          <SelectItem value="MERGE">{t("common.merge")}</SelectItem>
                          <SelectItem value="APPEND">{t("common.append")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </FieldGroup>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <FieldGroup>
                      <FieldLabel>{t("common.namespace")}</FieldLabel>
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
                      <FieldLabel>{t("common.key")}</FieldLabel>
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
                      <FieldLabel>{t("common.valueTemplate")}</FieldLabel>
                      <TemplateVariablePicker
                        options={templateVariables}
                        onSelect={(value) => insertMemoryWriteTemplate(index, value)}
                        label={t("common.insert")}
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
                    <FieldLabel>{t("common.visibilityLabel")}</FieldLabel>
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
                        <SelectValue placeholder={t("common.selectVisibility")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PUBLIC">{t("common.public")}</SelectItem>
                        <SelectItem value="PRIVATE">{t("common.private")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </FieldGroup>
                </div>
              ))
            )}
          </div>
        </FieldGroup>

        <DialogFooter className="gap-2 sm:justify-end">
          <Button type="submit">
            <SaveIcon className="size-4" />
            {t("common.save")}
          </Button>
        </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
