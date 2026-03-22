"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChevronRightIcon,
  SparklesIcon,
} from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import z from "zod";
import type { Edge, Node } from "@xyflow/react";
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
import {
  aiTextProviderSchema,
} from "../text/shared";
import {
  generateWorkflowGraphInputSchema,
  getDefaultWorkflowGeneratorModel,
} from "../workflow-generator/shared";
import { useI18n } from "@/features/i18n/provider";

const formSchema = generateWorkflowGraphInputSchema.safeExtend({
  model: z.string().trim().min(1),
});

const EXAMPLE_PROMPTS = [
  "Create a webhook workflow that receives a user question, analyzes it with AI, rewrites the final answer into a Feishu task dispatch message, and sends it with the native Feishu tool node.",
  "Build a problem-solving workflow that researches a public page with a browser tool, analyzes the findings with AI, drafts a final answer, and posts it to Feishu.",
  "Design a workflow that refines a draft in a local loop up to 3 iterations, rewrites the final result into a Feishu-friendly task update, and sends it with the native Feishu tool node.",
  "Create a research workflow that gathers context from a URL, extracts the key findings, drafts an executive summary with AI, and sends the result to Discord.",
  "Search the web for latest news about a topic, analyze with AI, and send results to Feishu.",
] as const;

const AI_CREDENTIAL_PROVIDERS = new Set([
  "GOOGLE",
  "OPENAI",
  "ANTHROPIC",
  "DEEPSEEK",
  "MINIMAX",
]);

export type WorkflowDraftPreview = {
  title: string;
  summary: string;
  notes: string[];
  nodes: Node[];
  edges: Edge[];
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (draft: WorkflowDraftPreview) => void;
  editorReady: boolean;
};

export const WorkflowGeneratorDialog = ({
  open,
  onOpenChange,
  onApply,
  editorReady,
}: Props) => {
  const { t } = useI18n();
  const trpc = useTRPC();
  const credentialsQuery = useQuery(trpc.credentials.getMany.queryOptions());
  const mutation = useMutation(trpc.ai.generateWorkflowGraph.mutationOptions());
  const [draft, setDraft] = useState<WorkflowDraftPreview | null>(null);

  const availableCredentials = useMemo(
    () =>
      (credentialsQuery.data ?? []).filter((credential) =>
        AI_CREDENTIAL_PROVIDERS.has(credential.provider),
      ),
    [credentialsQuery.data],
  );

  const form = useForm<z.input<typeof formSchema>, unknown, z.output<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      mode: "PROBLEM_SOLVER",
      provider: "MINIMAX",
      model: getDefaultWorkflowGeneratorModel("MINIMAX"),
      credentialId: "",
      credentialField: "apiKey",
    },
  });

  const generationMode = useWatch({
    control: form.control,
    name: "mode",
    defaultValue: "PROBLEM_SOLVER",
  });
  const provider = useWatch({
    control: form.control,
    name: "provider",
    defaultValue: "MINIMAX",
  });
  const selectedProvider = provider ?? "MINIMAX";
  const credentialId = useWatch({
    control: form.control,
    name: "credentialId",
    defaultValue: "",
  });

  const providerCredentials = availableCredentials.filter(
    (credential) => credential.provider === selectedProvider,
  );
  const generatedNodeCounts = useMemo(() => {
    if (!draft) {
      return [];
    }

    const counts = new Map<string, number>();
    for (const node of draft.nodes) {
      const key = node.type ?? "UNKNOWN";
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }

    return Array.from(counts.entries());
  }, [draft]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const currentCredential = providerCredentials.find(
      (credential) => credential.id === credentialId,
    );

    if (currentCredential) {
      return;
    }

    const fallbackCredential = providerCredentials[0];
    if (!fallbackCredential) {
      form.setValue("credentialId", "", {
        shouldDirty: false,
        shouldValidate: true,
      });
      return;
    }

    form.setValue("credentialId", fallbackCredential.id, {
      shouldDirty: false,
      shouldValidate: true,
    });
  }, [
    credentialId,
    form,
    mutation,
    onOpenChange,
    open,
    providerCredentials,
  ]);

  const handleGenerate = form.handleSubmit(async (values) => {
    const result = await mutation.mutateAsync(values);
    setDraft(result);
  });

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setDraft(null);
      mutation.reset();
    }

    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[920px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10">
              <SparklesIcon className="h-4 w-4 text-primary" />
            </div>
            <div className="space-y-1">
              <DialogTitle>{t("workflowGenerator.title")}</DialogTitle>
              <DialogDescription>
                {t("workflowGenerator.description")}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-border/70 bg-muted/30 px-2.5 py-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                {t("workflowGenerator.capabilityTrigger")}
              </span>
              <span className="rounded-full border border-border/70 bg-muted/30 px-2.5 py-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                {t("workflowGenerator.capabilityAi")}
              </span>
              <span className="rounded-full border border-border/70 bg-muted/30 px-2.5 py-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                {t("workflowGenerator.capabilityHttp")}
              </span>
              <span className="rounded-full border border-border/70 bg-muted/30 px-2.5 py-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                {t("workflowGenerator.capabilityMessaging")}
              </span>
              <span className="rounded-full border border-border/70 bg-muted/30 px-2.5 py-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                {t("workflowGenerator.capabilityLoop")}
              </span>
              <span className="rounded-full border border-border/70 bg-muted/30 px-2.5 py-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                {t("workflowGenerator.capabilityTool")}
              </span>
            </div>

            <FieldGroup className="gap-4 rounded-2xl border border-border/70 bg-background/60 p-4">
              <FieldGroup className="gap-3">
                <FieldLabel htmlFor="prompt">{t("workflowGenerator.workflowPrompt")}</FieldLabel>
                <Field>
                  <Textarea
                    id="prompt"
                    rows={10}
                    className="resize-none"
                    {...form.register("prompt")}
                    placeholder="Create a webhook workflow that receives a user question, analyzes it with AI, optionally refines the response in a loop, and sends the final answer to Feishu."
                  />
                </Field>
                <FieldDescription>
                  {t("workflowGenerator.promptDescription")}
                </FieldDescription>
                <FieldError errors={[form.formState.errors.prompt]} />
              </FieldGroup>

              <FieldGroup className="gap-3">
                <FieldLabel>{t("workflowGenerator.examples")}</FieldLabel>
                <div className="grid gap-2">
                {EXAMPLE_PROMPTS.map((examplePrompt) => (
                  <Button
                    key={examplePrompt}
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      form.setValue("prompt", examplePrompt, {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                    className="h-auto w-full justify-start rounded-xl border border-border/70 bg-muted/20 px-3 py-3 text-left text-sm leading-5 whitespace-normal hover:bg-muted/40"
                  >
                    <ChevronRightIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    <span>{examplePrompt}</span>
                  </Button>
                ))}
                </div>
              </FieldGroup>
            </FieldGroup>

            <FieldGroup className="gap-4 rounded-2xl border border-border/70 bg-muted/10 p-4">
              <div className="text-sm font-medium text-foreground">
                {t("workflowGenerator.settings")}
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <FieldGroup className="gap-2">
                  <FieldLabel htmlFor="mode">{t("workflowGenerator.mode")}</FieldLabel>
                  <Select
                    value={generationMode}
                    onValueChange={(
                      value: z.output<typeof generateWorkflowGraphInputSchema>["mode"],
                    ) =>
                      form.setValue("mode", value, {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("workflowGenerator.mode")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AUTO">{t("workflowGenerator.modeAuto")}</SelectItem>
                      <SelectItem value="SIMPLE">{t("workflowGenerator.modeSimple")}</SelectItem>
                      <SelectItem value="PROBLEM_SOLVER">
                        {t("workflowGenerator.modeProblemSolver")}
                      </SelectItem>
                      <SelectItem value="RESEARCH_DELIVERY">
                        {t("workflowGenerator.modeResearchDelivery")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldDescription>
                    {t("workflowGenerator.modeDescription")}
                  </FieldDescription>
                </FieldGroup>

                <FieldGroup className="gap-2">
                  <FieldLabel htmlFor="provider">{t("workflowGenerator.provider")}</FieldLabel>
                  <Select
                    value={selectedProvider}
                    onValueChange={(
                      value: z.infer<typeof aiTextProviderSchema>,
                    ) => {
                      form.setValue("provider", value, {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                      form.setValue("model", getDefaultWorkflowGeneratorModel(value), {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MINIMAX">MiniMax</SelectItem>
                      <SelectItem value="GOOGLE">Google Gemini</SelectItem>
                      <SelectItem value="OPENAI">OpenAI</SelectItem>
                      <SelectItem value="ANTHROPIC">Anthropic</SelectItem>
                      <SelectItem value="DEEPSEEK">DeepSeek</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldGroup>

                <FieldGroup className="gap-2">
                  <FieldLabel htmlFor="model">{t("workflowGenerator.model")}</FieldLabel>
                  <Field>
                    <Input
                      id="model"
                      {...form.register("model")}
                      placeholder={getDefaultWorkflowGeneratorModel(selectedProvider)}
                    />
                  </Field>
                </FieldGroup>
              </div>

              <div className="grid gap-4 md:grid-cols-[1fr_140px]">
                <FieldGroup className="gap-2">
                  <FieldLabel htmlFor="credentialId">{t("workflowGenerator.credential")}</FieldLabel>
                  <Select
                    value={credentialId}
                    onValueChange={(value) =>
                      form.setValue("credentialId", value, {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={`Select ${selectedProvider} credential`} />
                    </SelectTrigger>
                    <SelectContent>
                      {providerCredentials.map((credential) => (
                        <SelectItem key={credential.id} value={credential.id}>
                          {credential.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError errors={[form.formState.errors.credentialId]} />
                </FieldGroup>

                <FieldGroup className="gap-2">
                  <FieldLabel htmlFor="credentialField">{t("workflowGenerator.field")}</FieldLabel>
                  <Field>
                    <Input
                      id="credentialField"
                      {...form.register("credentialField")}
                      placeholder="apiKey"
                    />
                  </Field>
                </FieldGroup>
              </div>

              <FieldDescription>
                {t("workflowGenerator.suggestedDefault")}{" "}
                <code>{getDefaultWorkflowGeneratorModel(selectedProvider)}</code>
              </FieldDescription>
            </FieldGroup>

            <DialogFooter className="gap-2 sm:justify-between">
              <div className="text-xs text-muted-foreground">
                {t("workflowGenerator.applyWarning")}
              </div>
              <Button
                type="submit"
                disabled={
                  mutation.isPending ||
                  credentialsQuery.isLoading ||
                  providerCredentials.length === 0
                }
              >
                {mutation.isPending ? t("workflowGenerator.generating") : t("workflowGenerator.generateDraft")}
              </Button>
            </DialogFooter>
          </form>

          <div className="space-y-4 rounded-2xl border border-border/70 bg-muted/10 p-4">
            <div className="space-y-1">
              <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                {t("workflowGenerator.preview")}
              </div>
              <div className="text-sm text-muted-foreground">
                {draft
                  ? t("workflowGenerator.previewReady")
                  : t("workflowGenerator.previewEmpty")}
              </div>
            </div>

            {draft ? (
              <div className="space-y-4">
                <div className="rounded-xl border border-border/70 bg-background p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-semibold text-foreground">
                        {draft.title}
                      </h3>
                      <p className="pt-1 text-sm text-muted-foreground">
                        {draft.summary}
                      </p>
                    </div>
                    <div className="grid shrink-0 gap-1 text-right text-xs uppercase tracking-[0.16em] text-muted-foreground">
                      <span>{t("workflowGenerator.nodesCount", { count: draft.nodes.length })}</span>
                      <span>{t("workflowGenerator.edgesCount", { count: draft.edges.length })}</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-border/70 bg-background p-4">
                  <div className="text-sm font-medium text-foreground">
                    {t("workflowGenerator.graphMix")}
                  </div>
                  <div className="flex flex-wrap gap-2 pt-3">
                    {generatedNodeCounts.map(([type, count]) => (
                      <span
                        key={type}
                        className="rounded-full border border-border/70 bg-muted/20 px-2.5 py-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground"
                      >
                        {type} × {count}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-border/70 bg-background p-4">
                  <div className="text-sm font-medium text-foreground">
                    {t("workflowGenerator.loop")}
                  </div>
                  <p className="pt-3 text-sm text-muted-foreground">
                    {draft.nodes.some((node) => node.type === "LOOP")
                      ? t("workflowGenerator.loopPresent")
                      : t("workflowGenerator.loopMissing")}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium text-foreground">
                    {t("workflowGenerator.notes")}
                  </div>
                  <div className="space-y-2">
                    {draft.notes.length > 0 ? (
                      draft.notes.map((note) => (
                        <div
                          key={note}
                          className="rounded-lg border border-border/70 bg-background px-3 py-2 text-sm text-muted-foreground"
                        >
                          {note}
                        </div>
                      ))
                    ) : (
                      <div className="rounded-lg border border-dashed border-border/70 px-3 py-2 text-sm text-muted-foreground">
                        {t("workflowGenerator.noNotes")}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="button"
                    onClick={() => onApply(draft)}
                    disabled={!editorReady}
                  >
                    {t("workflowGenerator.applyToCanvas")}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border/70 bg-background px-4 py-6 text-sm text-muted-foreground">
                {t("workflowGenerator.describeWorkflow")}
              </div>
            )}

            {mutation.error ? (
              <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {mutation.error.message}
              </div>
            ) : null}
            {providerCredentials.length === 0 ? (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-700">
                {t("workflowGenerator.addCredential", { provider: selectedProvider })}
              </div>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
