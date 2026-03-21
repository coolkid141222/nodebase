"use client";

import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon, Trash2Icon, WrenchIcon } from "lucide-react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import z from "zod";
import { Button } from "@/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/dialog";
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
import { useTRPC } from "@/trpc/client";
import type { TemplateVariableOption } from "@/features/executions/components/template-variables";
import { TemplateVariablePicker } from "@/features/executions/components/template-variable-picker";
import {
  createDefaultExecutionMemoryWriteConfig,
  type ExecutionMemoryWriteConfig,
} from "@/features/executions/memory/shared";
import {
  toolNodeSchema,
  getToolArgumentsPlaceholder,
  getToolProviderLabel,
} from "../node/shared";
import { toolProviderSchema } from "../shared";
import { useI18n } from "@/features/i18n/provider";

const EMPTY_MEMORY_WRITES: ExecutionMemoryWriteConfig[] = [];

export type ToolFormValues = z.output<typeof toolNodeSchema>;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: ToolFormValues) => void;
  defaultProvider?: z.infer<typeof toolProviderSchema>;
  defaultServerId?: string;
  defaultServerDisplayName?: string;
  defaultToolId?: string;
  defaultToolDisplayName?: string;
  defaultArgumentsJson?: string;
  defaultMemoryWrites?: ExecutionMemoryWriteConfig[];
  templateVariables?: TemplateVariableOption[];
};

export const ToolDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultProvider = "INTERNAL",
  defaultServerId = "",
  defaultServerDisplayName = "",
  defaultToolId = "",
  defaultToolDisplayName = "",
  defaultArgumentsJson = "{}",
  defaultMemoryWrites,
  templateVariables = [],
}: Props) => {
  const { t } = useI18n();
  const trpc = useTRPC();
  const registryQuery = useQuery(trpc.tools.getRegistry.queryOptions());
  const initialMemoryWritesKey = JSON.stringify(
    defaultMemoryWrites ?? EMPTY_MEMORY_WRITES,
  );
  const initialMemoryWrites = useMemo(
    () => JSON.parse(initialMemoryWritesKey) as ExecutionMemoryWriteConfig[],
    [initialMemoryWritesKey],
  );
  const form = useForm<z.input<typeof toolNodeSchema>, unknown, ToolFormValues>({
    resolver: zodResolver(toolNodeSchema),
    defaultValues: {
      provider: defaultProvider,
      serverId: defaultServerId,
      serverDisplayName: defaultServerDisplayName,
      toolId: defaultToolId,
      toolDisplayName: defaultToolDisplayName,
      argumentsJson: defaultArgumentsJson,
      memoryWrites: initialMemoryWrites,
    },
  });
  const provider = useWatch({
    control: form.control,
    name: "provider",
    defaultValue: defaultProvider,
  });
  const serverId = useWatch({
    control: form.control,
    name: "serverId",
    defaultValue: defaultServerId,
  });
  const toolId = useWatch({
    control: form.control,
    name: "toolId",
    defaultValue: defaultToolId,
  });
  const {
    fields: memoryWriteFields,
    append: appendMemoryWrite,
    remove: removeMemoryWrite,
  } = useFieldArray({
    control: form.control,
    name: "memoryWrites",
  });
  const providerSummary = (registryQuery.data?.providers ?? []).find(
    (item) => item.id === provider,
  );
  const availableTools = (registryQuery.data?.tools ?? []).filter(
    (item) => item.provider === provider,
  );
  const mcpServers = registryQuery.data?.mcpServers ?? [];
  const selectedServer = mcpServers.find((item) => item.id === serverId);
  const selectedTool = availableTools.find((item) => item.id === toolId);

  useEffect(() => {
    form.reset({
      provider: defaultProvider,
      serverId: defaultServerId,
      serverDisplayName: defaultServerDisplayName,
      toolId: defaultToolId,
      toolDisplayName: defaultToolDisplayName,
      argumentsJson: defaultArgumentsJson,
      memoryWrites: initialMemoryWrites,
    });
  }, [
    defaultProvider,
    defaultServerId,
    defaultServerDisplayName,
    defaultToolId,
    defaultToolDisplayName,
    defaultArgumentsJson,
    initialMemoryWrites,
    form,
  ]);

  const insertIntoField = (template: string) => {
    const currentValue = form.getValues("argumentsJson") ?? "";
    const nextValue = currentValue.trim()
      ? `${currentValue}\n${template}`
      : template;

    form.setValue("argumentsJson", nextValue, {
      shouldDirty: true,
      shouldValidate: true,
    });
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
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <WrenchIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>{t("dialog.tool.title")}</DialogTitle>
              <DialogDescription className="pt-2">
                {t("dialog.tool.description")}{" "}
                <code>{"{{input}}"}</code>,{" "}
                <code>{"{{memory.shared.run.lastNode.result}}"}</code>, and{" "}
                <code>{"{{steps.NODE_ID.output}}"}</code>.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit((values) => {
            onSubmit({
              ...values,
              serverId: values.serverId.trim(),
              serverDisplayName: selectedServer?.displayName ?? "",
              toolId: values.toolId.trim(),
              toolDisplayName:
                selectedTool?.displayName ?? values.toolId.trim(),
            });
          })}
          className="space-y-4"
        >
          <FieldGroup className="rounded-xl border border-border/70 bg-muted/20 p-4">
            <FieldLabel>{t("dialog.tool.source")}</FieldLabel>
            <FieldDescription>
              {providerSummary?.description ??
                t("dialog.tool.sourceFallback")}
            </FieldDescription>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
              <span>{getToolProviderLabel(provider)}</span>
              <span className="rounded-full border border-border/70 px-2 py-1 tracking-normal text-[11px] normal-case">
                {providerSummary?.lifecycle ?? "READY"}
              </span>
            </div>
          </FieldGroup>

          <FieldGroup>
            <FieldLabel htmlFor="provider">{t("dialog.tool.provider")}</FieldLabel>
            <Select
              value={provider}
              onValueChange={(value: z.infer<typeof toolProviderSchema>) => {
                form.setValue("provider", value, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
                form.setValue("serverId", "", {
                  shouldDirty: true,
                });
                form.setValue("serverDisplayName", "", {
                  shouldDirty: true,
                });
                form.setValue("toolId", "", {
                  shouldDirty: true,
                });
                form.setValue("toolDisplayName", "", {
                  shouldDirty: true,
                });
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("common.selectProvider")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INTERNAL">{t("common.internalRuntime")}</SelectItem>
                <SelectItem value="MCP">{t("common.mcpServer")}</SelectItem>
                <SelectItem value="OPENCLAW">{t("common.openclawAdapter")}</SelectItem>
                <SelectItem value="FEISHU">{t("common.feishuAdapter")}</SelectItem>
              </SelectContent>
            </Select>
          </FieldGroup>

          {provider === "MCP" && (
            <FieldGroup>
              <FieldLabel htmlFor="serverId">{t("dialog.tool.server")}</FieldLabel>
              <Select
                value={serverId || "none"}
                onValueChange={(value) =>
                  form.setValue("serverId", value === "none" ? "" : value, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("common.selectServer")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{t("common.chooseLater")}</SelectItem>
                  {mcpServers.map((server) => (
                    <SelectItem key={server.id} value={server.id}>
                      {server.displayName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldDescription>
                {selectedServer?.statusMessage ??
                  (mcpServers.length === 0
                    ? t("dialog.tool.noMcpServers")
                    : t("dialog.tool.chooseMcpServer"))}
              </FieldDescription>
            </FieldGroup>
          )}

          <FieldGroup>
            <FieldLabel htmlFor="toolId">{t("dialog.tool.tool")}</FieldLabel>
            {availableTools.length > 0 ? (
              <Select
                value={toolId || "none"}
                onValueChange={(value) =>
                  form.setValue("toolId", value === "none" ? "" : value, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("common.selectTool")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{t("common.chooseLater")}</SelectItem>
                  {availableTools.map((tool) => (
                    <SelectItem key={tool.id} value={tool.id}>
                      {tool.displayName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Field>
                <Input
                  id="toolId"
                  {...form.register("toolId")}
                  placeholder={
                    provider === "MCP"
                      ? "server.tool_name"
                      : provider === "OPENCLAW"
                        ? "plugin.tool_name"
                        : provider === "FEISHU"
                          ? "feishu.tool_name"
                        : "internal.tool_id"
                  }
                />
              </Field>
            )}
            <FieldDescription>
              {selectedTool?.description ??
                (provider === "MCP"
                  ? t("dialog.tool.mcpTypeLater")
                  : provider === "OPENCLAW"
                    ? t("dialog.tool.openclawLater")
                    : provider === "FEISHU"
                      ? t("dialog.tool.feishuLater")
                      : t("dialog.tool.selectBuiltIn"))}
            </FieldDescription>
            <FieldError errors={[form.formState.errors.toolId]} />
          </FieldGroup>

          {selectedTool && (
            <FieldGroup className="rounded-xl border border-border/70 bg-background p-4">
              <FieldLabel>{t("dialog.tool.selectedDetails")}</FieldLabel>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>{selectedTool.description}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border border-border/70 px-2 py-1 text-[11px] uppercase tracking-[0.16em]">
                    {selectedTool.lifecycle}
                  </span>
                  <span className="rounded-full border border-border/70 px-2 py-1 text-[11px] uppercase tracking-[0.16em]">
                    {selectedTool.transport}
                  </span>
                  {selectedTool.dangerous ? (
                    <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-[11px] uppercase tracking-[0.16em] text-amber-700">
                      {t("dialog.tool.dangerous")}
                    </span>
                  ) : null}
                </div>
                {selectedTool.parameters.length > 0 ? (
                  <ul className="space-y-1">
                    {selectedTool.parameters.map((parameter) => (
                      <li key={parameter.key}>
                        <strong>{parameter.label}</strong>:{" "}
                        {parameter.description}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </FieldGroup>
          )}

          <FieldGroup>
            <div className="flex items-center justify-between gap-3">
              <FieldLabel htmlFor="argumentsJson">{t("dialog.tool.argumentsJson")}</FieldLabel>
              <TemplateVariablePicker
                options={templateVariables}
                onSelect={insertIntoField}
              />
            </div>
            <Field>
              <Textarea
                id="argumentsJson"
                rows={7}
                className="resize-none font-mono text-sm"
                {...form.register("argumentsJson")}
                placeholder={getToolArgumentsPlaceholder(selectedTool?.id ?? toolId)}
              />
            </Field>
            <FieldDescription>
              {t("dialog.tool.argumentsDescription")}
            </FieldDescription>
            <FieldError errors={[form.formState.errors.argumentsJson]} />
          </FieldGroup>

          <FieldGroup className="rounded-xl border border-border/70 bg-muted/20 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <FieldLabel>{t("dialog.ai.writeMemory")}</FieldLabel>
                <FieldDescription>
                  {t("dialog.tool.writeMemoryDescription")}{" "}
                  <code>{"{{current.output}}"}</code>,{" "}
                  <code>{"{{current.output.result}}"}</code>,{" "}
                  <code>{"{{memory.shared.run.lastNode.result}}"}</code>.
                </FieldDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  appendMemoryWrite(createDefaultExecutionMemoryWriteConfig())
                }
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
                          onValueChange={(
                            value: "REPLACE" | "MERGE" | "APPEND",
                          ) =>
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
                          errors={[
                            form.formState.errors.memoryWrites?.[index]
                              ?.namespace,
                          ]}
                        />
                      </FieldGroup>

                      <FieldGroup>
                        <FieldLabel>{t("common.key")}</FieldLabel>
                        <Field>
                          <Input
                            {...form.register(`memoryWrites.${index}.key`)}
                            placeholder="tool_output"
                          />
                        </Field>
                        <FieldError
                          errors={[
                            form.formState.errors.memoryWrites?.[index]?.key,
                          ]}
                        />
                      </FieldGroup>
                    </div>

                    <FieldGroup>
                      <div className="flex items-center justify-between gap-3">
                        <FieldLabel>{t("common.valueTemplate")}</FieldLabel>
                        <TemplateVariablePicker
                          options={templateVariables}
                          onSelect={(value) =>
                            insertMemoryWriteTemplate(index, value)
                          }
                          label={t("common.insert")}
                        />
                      </div>
                      <Field>
                        <Textarea
                          rows={3}
                          className="resize-none"
                          {...form.register(`memoryWrites.${index}.value`)}
                          placeholder='{{current.output}}'
                        />
                      </Field>
                      <FieldError
                        errors={[
                          form.formState.errors.memoryWrites?.[index]?.value,
                        ]}
                      />
                    </FieldGroup>

                    <FieldGroup>
                      <FieldLabel>{t("common.visibilityLabel")}</FieldLabel>
                      <Select
                        defaultValue={field.visibility}
                        onValueChange={(value: "PUBLIC" | "PRIVATE") =>
                          form.setValue(
                            `memoryWrites.${index}.visibility`,
                            value,
                            {
                              shouldDirty: true,
                              shouldValidate: true,
                            },
                          )
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
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? t("common.running") : t("common.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
