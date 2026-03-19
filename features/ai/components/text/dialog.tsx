"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { BotIcon } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
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

const formSchema = aiTextNodeSchema.extend({
  system: z.string().optional(),
});

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
}: Props) => {
  const trpc = useTRPC();
  const credentialsQuery = useQuery(trpc.credentials.getMany.queryOptions());

  const form = useForm<z.input<typeof formSchema>, unknown, AITextFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      provider: defaultProvider,
      model: defaultModel,
      prompt: defaultPrompt,
      system: defaultSystem,
      credentialId: defaultCredentialId,
      credentialField: defaultCredentialField,
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
  const credentials = (credentialsQuery.data ?? []).filter(
    (credential) => credential.provider === selectedProvider,
  );

  useEffect(() => {
    form.reset({
      provider: defaultProvider,
      model: defaultModel,
      prompt: defaultPrompt,
      system: defaultSystem,
      credentialId: defaultCredentialId,
      credentialField: defaultCredentialField,
    });
  }, [
    defaultProvider,
    defaultModel,
    defaultPrompt,
    defaultSystem,
    defaultCredentialId,
    defaultCredentialField,
    form,
  ]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <BotIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Configure AI Text</DialogTitle>
              <DialogDescription className="pt-2">
                Generate text with Gemini, OpenAI, or Anthropic. Prompt and
                system fields support workflow templates like{" "}
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
            <FieldLabel htmlFor="provider">Provider</FieldLabel>
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
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GOOGLE">Google Gemini</SelectItem>
                <SelectItem value="OPENAI">OpenAI</SelectItem>
                <SelectItem value="ANTHROPIC">Anthropic</SelectItem>
              </SelectContent>
            </Select>
          </FieldGroup>

          <FieldGroup>
            <FieldLabel htmlFor="model">Model</FieldLabel>
            <Field>
              <Input
                id="model"
                {...form.register("model")}
                 placeholder={getDefaultAITextModel(selectedProvider)}
               />
             </Field>
             <FieldDescription>
               Suggested default: <code>{getDefaultAITextModel(selectedProvider)}</code>
             </FieldDescription>
            <FieldError errors={[form.formState.errors.model]} />
          </FieldGroup>

          <FieldGroup>
            <FieldLabel htmlFor="credentialId">Credential</FieldLabel>
            <Select
              value={credentialId}
              onValueChange={(value) =>
                form.setValue("credentialId", value, { shouldValidate: true })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={`Select ${selectedProvider} credential`} />
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
            <FieldLabel htmlFor="credentialField">Secret JSON field</FieldLabel>
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
            <FieldLabel htmlFor="system">System prompt</FieldLabel>
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
            <FieldLabel htmlFor="prompt">Prompt</FieldLabel>
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

          <DialogFooter className="gap-2 sm:justify-end">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
