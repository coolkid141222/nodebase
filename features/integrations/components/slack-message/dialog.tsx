"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { MessageSquareIcon } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
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
  slackMessageNodeSchema,
  type SlackMessageNodeData,
} from "../../slack/shared";

export type SlackMessageFormValues = SlackMessageNodeData & {
  credentialId: string;
  credentialField: string;
  content: string;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: SlackMessageFormValues) => void;
  defaultCredentialId?: string;
  defaultCredentialField?: string;
  defaultContent?: string;
};

export const SlackMessageDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultCredentialId = "",
  defaultCredentialField = "webhookUrl",
  defaultContent = "",
}: Props) => {
  const trpc = useTRPC();
  const credentialsQuery = useQuery(trpc.credentials.getMany.queryOptions());
  const slackCredentials = (credentialsQuery.data ?? []).filter(
    (credential) => credential.provider === "SLACK",
  );

  const form = useForm<SlackMessageFormValues>({
    resolver: zodResolver(slackMessageNodeSchema),
    defaultValues: {
      credentialId: defaultCredentialId,
      credentialField: defaultCredentialField,
      content: defaultContent,
    },
  });
  const credentialId = useWatch({
    control: form.control,
    name: "credentialId",
    defaultValue: defaultCredentialId,
  });

  useEffect(() => {
    form.reset({
      credentialId: defaultCredentialId,
      credentialField: defaultCredentialField,
      content: defaultContent,
    });
  }, [defaultCredentialField, defaultCredentialId, defaultContent, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <MessageSquareIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Configure Slack Message</DialogTitle>
              <DialogDescription className="pt-2">
                Send a templated message to a Slack webhook credential. The
                message field supports workflow templates like{" "}
                <code>{"{{steps.NODE_ID.output.text}}"}</code>.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup>
            <FieldLabel htmlFor="credentialId">Slack credential</FieldLabel>
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
                <SelectValue placeholder="Select Slack credential" />
              </SelectTrigger>
              <SelectContent>
                {slackCredentials.map((credential) => (
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
                placeholder="webhookUrl"
              />
            </Field>
            <FieldError errors={[form.formState.errors.credentialField]} />
          </FieldGroup>

          <FieldGroup>
            <FieldLabel htmlFor="content">Message</FieldLabel>
            <Field>
              <Textarea
                id="content"
                rows={8}
                className="resize-none"
                {...form.register("content")}
                placeholder="Workflow {{execution.id}} completed successfully."
              />
            </Field>
            <FieldError errors={[form.formState.errors.content]} />
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
