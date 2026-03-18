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
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/field";
import { Textarea } from "@/components/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/select";
import { CredentialProvider } from "@/lib/prisma/client";
import { useTRPC } from "@/trpc/client";
import { aiTextModelSchema, aiTextNodeSchema } from "../../text/shared";

const formSchema = aiTextNodeSchema.extend({
  system: z.string().optional(),
});

export type AITextFormValues = z.infer<typeof formSchema>;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: AITextFormValues) => void;
  defaultProvider?: "GOOGLE";
  defaultModel?: z.infer<typeof aiTextModelSchema>;
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
  defaultModel = "gemini-2.5-flash",
  defaultPrompt = "",
  defaultSystem = "",
  defaultCredentialId = "",
  defaultCredentialField = "apiKey",
}: Props) => {
  const trpc = useTRPC();
  const credentialsQuery = useQuery(trpc.credentials.getMany.queryOptions());
  const googleCredentials = (credentialsQuery.data ?? []).filter(
    (credential) => credential.provider === CredentialProvider.GOOGLE,
  );

  const form = useForm<AITextFormValues>({
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
  });
  const model = useWatch({
    control: form.control,
    name: "model",
  });
  const credentialId = useWatch({
    control: form.control,
    name: "credentialId",
  });

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
                Generate text with Gemini. Prompt and system fields support
                workflow templates like <code>{"{{steps.NODE_ID.output.body}}"}</code>.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup>
            <FieldLabel htmlFor="provider">Provider</FieldLabel>
            <Select
              value={provider}
              onValueChange={(value: "GOOGLE") =>
                form.setValue("provider", value, { shouldValidate: true })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GOOGLE">Google Gemini</SelectItem>
              </SelectContent>
            </Select>
          </FieldGroup>

          <FieldGroup>
            <FieldLabel htmlFor="model">Model</FieldLabel>
            <Select
              value={model}
              onValueChange={(value: z.infer<typeof aiTextModelSchema>) =>
                form.setValue("model", value, { shouldValidate: true })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gemini-2.5-flash">gemini-2.5-flash</SelectItem>
                <SelectItem value="gemini-2.5-flash-lite">
                  gemini-2.5-flash-lite
                </SelectItem>
              </SelectContent>
            </Select>
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
                <SelectValue placeholder="Select Google credential" />
              </SelectTrigger>
              <SelectContent>
                {googleCredentials.map((credential) => (
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
              <input
                id="credentialField"
                {...form.register("credentialField")}
                placeholder="apiKey"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
