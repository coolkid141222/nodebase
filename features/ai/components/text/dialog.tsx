"use client";

import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { BotIcon, PlusIcon, SparklesIcon, Trash2Icon } from "lucide-react";
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
import { Textarea } from "@/components/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/select";
import { useTRPC } from "@/trpc/client";
import {
  aiTextNodeSchema,
  aiTextProviderSchema,
  getDefaultAITextModel,
} from "../../text/shared";
import { getToolArgumentsPlaceholder } from "@/features/tools/node/shared";
import { toolProviderSchema } from "@/features/tools/shared";
import {
  createDefaultExecutionMemoryWriteConfig,
  type ExecutionMemoryWriteConfig,
} from "@/features/executions/memory/shared";
import { TemplateVariablePicker } from "@/features/executions/components/template-variable-picker";
import type { TemplateVariableOption } from "@/features/executions/components/template-variables";
import { Switch } from "@/components/switch";
import { useI18n } from "@/features/i18n/provider";

const formSchema = aiTextNodeSchema.safeExtend({
  system: z.string().optional(),
});

const EMPTY_MEMORY_WRITES: ExecutionMemoryWriteConfig[] = [];

export type AITextFormValues = z.output<typeof formSchema>;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: AITextFormValues) => void;
  defaultProvider?: z.infer<typeof aiTextProviderSchema>;
  defaultModel?: string;
  defaultPrompt?: string;
  defaultSystem?: string;
  defaultCredentialId?: string;
  defaultCredentialField?: string;
  defaultToolEnabled?: boolean;
  defaultToolProvider?: z.infer<typeof toolProviderSchema>;
  defaultToolServerId?: string;
  defaultToolId?: string;
  defaultToolDisplayName?: string;
  defaultToolArgumentsJson?: string;
  defaultMemoryContextEnabled?: boolean;
  defaultMemoryContextScope?: "WORKFLOW" | "USER";
  defaultMemoryContextQuery?: string;
  defaultMemoryContextLimit?: number;
  defaultMemoryWrites?: ExecutionMemoryWriteConfig[];
  templateVariables?: TemplateVariableOption[];
};

export const AITextDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultProvider = "GOOGLE",
  defaultModel = getDefaultAITextModel(defaultProvider),
  defaultPrompt = "",
  defaultSystem = "",
  defaultCredentialId = "",
  defaultCredentialField = "apiKey",
  defaultToolEnabled = false,
  defaultToolProvider = "INTERNAL",
  defaultToolServerId = "",
  defaultToolId = "",
  defaultToolDisplayName = "",
  defaultToolArgumentsJson = "{}",
  defaultMemoryContextEnabled = false,
  defaultMemoryContextScope = "WORKFLOW",
  defaultMemoryContextQuery = "{{input}}",
  defaultMemoryContextLimit = 3,
  defaultMemoryWrites,
  templateVariables = [],
}: Props) => {
  const { t } = useI18n();
  const trpc = useTRPC();
  const credentialsQuery = useQuery(trpc.credentials.getMany.queryOptions());
  const registryQuery = useQuery(trpc.tools.getRegistry.queryOptions());
  const initialMemoryWritesKey = JSON.stringify(
    defaultMemoryWrites ?? EMPTY_MEMORY_WRITES,
  );
  const initialMemoryWrites = useMemo(
    () =>
      JSON.parse(initialMemoryWritesKey) as ExecutionMemoryWriteConfig[],
    [initialMemoryWritesKey],
  );

  const form = useForm<z.input<typeof formSchema>, unknown, AITextFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      provider: defaultProvider,
      model: defaultModel,
      prompt: defaultPrompt,
      system: defaultSystem,
      credentialId: defaultCredentialId,
      credentialField: defaultCredentialField,
      toolEnabled: defaultToolEnabled,
      toolProvider: defaultToolProvider,
      toolServerId: defaultToolServerId,
      toolId: defaultToolId,
      toolDisplayName: defaultToolDisplayName,
      toolArgumentsJson: defaultToolArgumentsJson,
      memoryContextEnabled: defaultMemoryContextEnabled,
      memoryContextScope: defaultMemoryContextScope,
      memoryContextQuery: defaultMemoryContextQuery,
      memoryContextLimit: defaultMemoryContextLimit,
      memoryWrites: initialMemoryWrites,
    },
  });
  const provider = useWatch({
    control: form.control,
    name: "provider",
    defaultValue: defaultProvider,
  });
  const selectedProvider = provider ?? defaultProvider;
  const credentialId = useWatch({
    control: form.control,
    name: "credentialId",
    defaultValue: defaultCredentialId,
  });
  const toolEnabled = useWatch({
    control: form.control,
    name: "toolEnabled",
    defaultValue: defaultToolEnabled,
  });
  const memoryContextEnabled = useWatch({
    control: form.control,
    name: "memoryContextEnabled",
    defaultValue: defaultMemoryContextEnabled,
  });
  const memoryContextScope = useWatch({
    control: form.control,
    name: "memoryContextScope",
    defaultValue: defaultMemoryContextScope,
  });
  const watchedMemoryWrites = useWatch({
    control: form.control,
    name: "memoryWrites",
    defaultValue: initialMemoryWrites,
  });
  const toolId = useWatch({
    control: form.control,
    name: "toolId",
    defaultValue: defaultToolId,
  });
  const credentials = (credentialsQuery.data ?? []).filter(
    (credential) => credential.provider === selectedProvider,
  );
  const browserTools = (registryQuery.data?.tools ?? []).filter(
    (tool) =>
      tool.provider === "INTERNAL" &&
      tool.capabilities.includes("BROWSER") &&
      tool.lifecycle === "READY",
  );
  const selectedBrowserTool = browserTools.find((tool) => tool.id === toolId);
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
      provider: defaultProvider,
      model: defaultModel,
      prompt: defaultPrompt,
      system: defaultSystem,
      credentialId: defaultCredentialId,
      credentialField: defaultCredentialField,
      toolEnabled: defaultToolEnabled,
      toolProvider: defaultToolProvider,
      toolServerId: defaultToolServerId,
      toolId: defaultToolId,
      toolDisplayName: defaultToolDisplayName,
      toolArgumentsJson: defaultToolArgumentsJson,
      memoryContextEnabled: defaultMemoryContextEnabled,
      memoryContextScope: defaultMemoryContextScope,
      memoryContextQuery: defaultMemoryContextQuery,
      memoryContextLimit: defaultMemoryContextLimit,
      memoryWrites: initialMemoryWrites,
    });
  }, [
    defaultProvider,
    defaultModel,
    defaultPrompt,
    defaultSystem,
    defaultCredentialId,
    defaultCredentialField,
    defaultToolEnabled,
    defaultToolProvider,
    defaultToolServerId,
    defaultToolId,
    defaultToolDisplayName,
    defaultToolArgumentsJson,
    defaultMemoryContextEnabled,
    defaultMemoryContextScope,
    defaultMemoryContextQuery,
    defaultMemoryContextLimit,
    initialMemoryWrites,
    form,
  ]);

  useEffect(() => {
    if (!toolEnabled || toolId || browserTools.length === 0) {
      return;
    }

    const defaultTool = browserTools[0];
    form.setValue("toolProvider", "INTERNAL", {
      shouldDirty: true,
    });
    form.setValue("toolServerId", "", {
      shouldDirty: true,
    });
    form.setValue("toolId", defaultTool.id, {
      shouldDirty: true,
      shouldValidate: true,
    });
    form.setValue("toolDisplayName", defaultTool.displayName, {
      shouldDirty: true,
    });
  }, [browserTools, form, toolEnabled, toolId]);

  const insertIntoField = (
    field: "system" | "prompt",
    template: string,
    joiner = "\n\n",
  ) => {
    const currentValue = form.getValues(field) ?? "";
    const nextValue = currentValue.trim()
      ? `${currentValue}${joiner}${template}`
      : template;

    form.setValue(field, nextValue, {
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

  const insertToolArgumentTemplate = (template: string) => {
    const currentValue = form.getValues("toolArgumentsJson") ?? "";
    const nextValue = currentValue.trim()
      ? `${currentValue}\n${template}`
      : template;

    form.setValue("toolArgumentsJson", nextValue, {
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
              <BotIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>{t("dialog.ai.title")}</DialogTitle>
              <DialogDescription className="pt-2">
                {t("dialog.ai.description")} <code>{"{{input}}"}</code>,{" "}
                <code>{"{{inputRaw.body.message}}"}</code>,{" "}
                <code>{"{{memory.shared.nodesById.NODE_ID.output}}"}</code>,{" "}
                <code>{"{{memory.node.run.output}}"}</code>,{" "}
                <code>{"{{steps.NODE_ID.output.body}}"}</code>.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit((values) => onSubmit(values))}
          className="space-y-4"
        >
          <FieldGroup>
            <FieldLabel htmlFor="provider">{t("dialog.ai.provider")}</FieldLabel>
            <Select
              value={provider}
              onValueChange={(value: z.infer<typeof aiTextProviderSchema>) => {
                form.setValue("provider", value, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
                form.setValue("credentialId", "", {
                  shouldDirty: true,
                  shouldValidate: true,
                });
                form.setValue("model", getDefaultAITextModel(value), {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("common.selectProvider")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GOOGLE">Google Gemini</SelectItem>
                <SelectItem value="OPENAI">OpenAI</SelectItem>
                <SelectItem value="ANTHROPIC">Anthropic</SelectItem>
                <SelectItem value="DEEPSEEK">DeepSeek</SelectItem>
                <SelectItem value="MINIMAX">MiniMax</SelectItem>
              </SelectContent>
            </Select>
          </FieldGroup>

          <FieldGroup>
            <FieldLabel htmlFor="model">{t("dialog.ai.model")}</FieldLabel>
            <Field>
              <Input
                id="model"
                {...form.register("model")}
                 placeholder={getDefaultAITextModel(selectedProvider)}
               />
             </Field>
             <FieldDescription>
               {t("dialog.ai.suggestedDefault")} <code>{getDefaultAITextModel(selectedProvider)}</code>
             </FieldDescription>
            <FieldError errors={[form.formState.errors.model]} />
          </FieldGroup>

          <FieldGroup>
            <FieldLabel htmlFor="credentialId">{t("dialog.ai.credential")}</FieldLabel>
            <Select
              value={credentialId}
              onValueChange={(value) =>
                form.setValue("credentialId", value, { shouldValidate: true })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={`${t("common.selectCredential")} ${selectedProvider}`} />
              </SelectTrigger>
              <SelectContent>
                {credentials.map((credential) => (
                  <SelectItem key={credential.id} value={credential.id}>
                    {credential.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError errors={[form.formState.errors.credentialId]} />
          </FieldGroup>

          <FieldGroup>
            <FieldLabel htmlFor="credentialField">{t("dialog.ai.secretField")}</FieldLabel>
            <Field>
              <Input
                id="credentialField"
                {...form.register("credentialField")}
                placeholder="apiKey"
              />
            </Field>
            <FieldError errors={[form.formState.errors.credentialField]} />
          </FieldGroup>

          <FieldGroup>
            <div className="flex items-center justify-between gap-3">
              <FieldLabel htmlFor="system">System prompt</FieldLabel>
              <TemplateVariablePicker
                options={templateVariables}
                onSelect={(value) => insertIntoField("system", value, "\n")}
              />
            </div>
            <Field>
              <Textarea
                id="system"
                rows={4}
                className="resize-none"
                {...form.register("system")}
                placeholder="You are a concise assistant."
              />
            </Field>
            <FieldError errors={[form.formState.errors.system]} />
          </FieldGroup>

          <FieldGroup>
            <div className="flex items-center justify-between gap-3">
              <FieldLabel htmlFor="prompt">Prompt</FieldLabel>
              <TemplateVariablePicker
                options={templateVariables}
                onSelect={(value) => insertIntoField("prompt", value)}
              />
            </div>
            <Field>
              <Textarea
                id="prompt"
                rows={8}
                className="resize-none"
                {...form.register("prompt")}
                placeholder="Summarize the HTTP response into 3 bullet points."
              />
            </Field>
            <FieldError errors={[form.formState.errors.prompt]} />
          </FieldGroup>

          <FieldGroup className="rounded-2xl border border-border/70 bg-gradient-to-br from-muted/35 via-background to-muted/10 p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <SparklesIcon className="size-4 text-primary" />
                  <FieldLabel>{t("dialog.ai.researchContext")}</FieldLabel>
                </div>
                <FieldDescription>
                  {t("dialog.ai.researchContextDescription")}
                </FieldDescription>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {toolEnabled ? t("common.enabled") : t("common.off")}
                </span>
                <Switch
                  checked={toolEnabled}
                  onCheckedChange={(checked) =>
                    form.setValue("toolEnabled", checked, {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                />
              </div>
            </div>

            {toolEnabled ? (
              <div className="space-y-4">
                <FieldGroup className="rounded-xl border border-border/70 bg-background/80 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[11px] uppercase tracking-[0.16em] text-emerald-700">
                      {t("common.internalBrowser")}
                    </span>
                    <span className="rounded-full border border-border/70 px-2 py-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                      {t("common.mcpReadySlot")}
                    </span>
                  </div>
                  <FieldDescription>
                    {t("dialog.ai.researchSlotDescription")}
                  </FieldDescription>
                </FieldGroup>

                <FieldGroup>
                  <FieldLabel htmlFor="toolId">{t("dialog.ai.browserTool")}</FieldLabel>
                  <Select
                    value={toolId || "none"}
                    onValueChange={(value) => {
                      const nextToolId = value === "none" ? "" : value;
                      const nextTool = browserTools.find(
                        (tool) => tool.id === nextToolId,
                      );
                      form.setValue("toolProvider", "INTERNAL", {
                        shouldDirty: true,
                      });
                      form.setValue("toolServerId", "", {
                        shouldDirty: true,
                      });
                      form.setValue("toolId", nextToolId, {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                      form.setValue("toolDisplayName", nextTool?.displayName ?? "", {
                        shouldDirty: true,
                      });
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("dialog.ai.selectBrowserTool")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">{t("common.chooseLater")}</SelectItem>
                      {browserTools.map((tool) => (
                        <SelectItem key={tool.id} value={tool.id}>
                          {tool.displayName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldDescription>
                    {browserTools.length === 0
                      ? t("dialog.ai.noBrowserTools")
                      : selectedBrowserTool?.description ??
                        t("dialog.ai.chooseBrowserTool")}
                  </FieldDescription>
                  <FieldError errors={[form.formState.errors.toolId]} />
                </FieldGroup>

                <FieldGroup>
                  <div className="flex items-center justify-between gap-3">
                    <FieldLabel htmlFor="toolArgumentsJson">
                      {t("dialog.ai.browserToolArguments")}
                    </FieldLabel>
                    <TemplateVariablePicker
                      options={templateVariables}
                      onSelect={insertToolArgumentTemplate}
                      label={t("common.insert")}
                    />
                  </div>
                  <Field>
                    <Textarea
                      id="toolArgumentsJson"
                      rows={5}
                      className="resize-none font-mono text-sm"
                      {...form.register("toolArgumentsJson")}
                      placeholder={getToolArgumentsPlaceholder(
                        selectedBrowserTool?.id ?? toolId,
                      )}
                    />
                  </Field>
                  <FieldDescription>
                    {t("dialog.ai.browserResultAppended")}
                  </FieldDescription>
                </FieldGroup>
              </div>
            ) : null}
          </FieldGroup>

          <FieldGroup className="rounded-2xl border border-border/70 bg-muted/15 p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <SparklesIcon className="size-4 text-primary" />
                  <FieldLabel>{t("dialog.ai.persistentRecall")}</FieldLabel>
                </div>
                <FieldDescription>
                  {t("dialog.ai.persistentRecallDescription")}
                </FieldDescription>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {memoryContextEnabled ? t("common.enabled") : t("common.off")}
                </span>
                <Switch
                  checked={memoryContextEnabled}
                  onCheckedChange={(checked) =>
                    form.setValue("memoryContextEnabled", checked, {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                />
              </div>
            </div>

            {memoryContextEnabled ? (
              <div className="space-y-4">
                <div className="grid gap-3 md:grid-cols-[1fr_120px]">
                  <FieldGroup>
                    <FieldLabel>{t("dialog.ai.recallScope")}</FieldLabel>
                    <Select
                      value={memoryContextScope}
                      onValueChange={(value: "WORKFLOW" | "USER") =>
                        form.setValue("memoryContextScope", value, {
                          shouldDirty: true,
                          shouldValidate: true,
                        })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t("common.selectScope")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="WORKFLOW">{t("common.workflow")}</SelectItem>
                        <SelectItem value="USER">{t("common.user")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </FieldGroup>

                  <FieldGroup>
                    <FieldLabel htmlFor="memoryContextLimit">Top K</FieldLabel>
                    <Field>
                      <Input
                        id="memoryContextLimit"
                        type="number"
                        min={1}
                        max={8}
                        {...form.register("memoryContextLimit", {
                          valueAsNumber: true,
                        })}
                      />
                    </Field>
                    <FieldError
                      errors={[form.formState.errors.memoryContextLimit]}
                    />
                  </FieldGroup>
                </div>

                <FieldGroup>
                  <div className="flex items-center justify-between gap-3">
                    <FieldLabel htmlFor="memoryContextQuery">{t("dialog.ai.recallQuery")}</FieldLabel>
                    <TemplateVariablePicker
                      options={templateVariables}
                      onSelect={(value) => {
                        const currentValue = form.getValues("memoryContextQuery") ?? "";
                        const nextValue = currentValue.trim()
                          ? `${currentValue}\n${value}`
                          : value;

                        form.setValue("memoryContextQuery", nextValue, {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                      }}
                      label={t("common.insert")}
                    />
                  </div>
                  <Field>
                    <Textarea
                      id="memoryContextQuery"
                      rows={3}
                      className="resize-none"
                      {...form.register("memoryContextQuery")}
                      placeholder="{{input}}"
                    />
                  </Field>
                  <FieldDescription>
                    {t("dialog.ai.recallQueryDescription")}
                    <code>{" {{input}}"}</code>,{" "}
                    <code>{"{{memory.shared.problem.task}}"}</code>,{" "}
                    <code>{"{{trigger.body.message}}"}</code>.
                  </FieldDescription>
                  <FieldError
                    errors={[form.formState.errors.memoryContextQuery]}
                  />
                </FieldGroup>
              </div>
            ) : null}
          </FieldGroup>

          <FieldGroup className="rounded-xl border border-border/70 bg-muted/20 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <FieldLabel>{t("dialog.ai.writeMemory")}</FieldLabel>
                <FieldDescription>
                  {t("dialog.ai.writeMemoryDescription")} <code>{"{{current.output}}"}</code>,{" "}
                  <code>{"{{current.output.text}}"}</code>,{" "}
                  <code>{"{{memory.shared.run.trigger}}"}</code>.
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
                            placeholder="summary"
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
                          placeholder='{{current.output.text}}'
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

                    <div className="grid gap-3 md:grid-cols-[1fr_1fr]">
                      <FieldGroup className="rounded-lg border border-border/70 bg-muted/15 p-3">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <FieldLabel>{t("dialog.ai.persistBeyondRun")}</FieldLabel>
                            <FieldDescription>
                              {t("dialog.ai.persistBeyondRunDescription")}
                            </FieldDescription>
                          </div>
                          <Switch
                            checked={Boolean(watchedMemoryWrites?.[index]?.persist)}
                            onCheckedChange={(checked) =>
                              form.setValue(`memoryWrites.${index}.persist`, checked, {
                                shouldDirty: true,
                                shouldValidate: true,
                              })
                            }
                          />
                        </div>
                      </FieldGroup>

                      <FieldGroup className="rounded-lg border border-border/70 bg-muted/15 p-3">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <FieldLabel>{t("dialog.ai.semanticIndex")}</FieldLabel>
                            <FieldDescription>
                              {t("dialog.ai.semanticIndexDescription")}
                            </FieldDescription>
                          </div>
                          <Switch
                            checked={Boolean(
                              watchedMemoryWrites?.[index]?.semanticIndex,
                            )}
                            onCheckedChange={(checked) =>
                              form.setValue(`memoryWrites.${index}.semanticIndex`, checked, {
                                shouldDirty: true,
                                shouldValidate: true,
                              })
                            }
                          />
                        </div>
                      </FieldGroup>
                    </div>

                    {watchedMemoryWrites?.[index]?.persist ? (
                      <FieldGroup>
                        <FieldLabel>{t("dialog.ai.persistentScope")}</FieldLabel>
                        <Select
                          defaultValue={field.persistenceScope}
                          onValueChange={(value: "WORKFLOW" | "USER") =>
                            form.setValue(`memoryWrites.${index}.persistenceScope`, value, {
                              shouldDirty: true,
                              shouldValidate: true,
                            })
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={t("common.selectScope")} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="WORKFLOW">{t("common.workflow")}</SelectItem>
                            <SelectItem value="USER">{t("common.user")}</SelectItem>
                          </SelectContent>
                        </Select>
                      </FieldGroup>
                    ) : null}
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
