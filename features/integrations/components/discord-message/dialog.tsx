"use client";

import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { MessageSquareIcon, PlusIcon, Trash2Icon } from "lucide-react";
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
import { discordMessageNodeSchema } from "../../discord/shared";
import {
  createDefaultExecutionMemoryWriteConfig,
  type ExecutionMemoryWriteConfig,
} from "@/features/executions/memory/shared";
import { TemplateVariablePicker } from "@/features/executions/components/template-variable-picker";
import type { TemplateVariableOption } from "@/features/executions/components/template-variables";

const EMPTY_MEMORY_WRITES: ExecutionMemoryWriteConfig[] = [];

export type DiscordMessageFormValues = z.output<typeof discordMessageNodeSchema>;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: DiscordMessageFormValues) => void;
  defaultCredentialId?: string;
  defaultCredentialField?: string;
  defaultContent?: string;
  defaultMemoryWrites?: ExecutionMemoryWriteConfig[];
  templateVariables?: TemplateVariableOption[];
};

export const DiscordMessageDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultCredentialId = "",
  defaultCredentialField = "webhookUrl",
  defaultContent = "",
  defaultMemoryWrites,
  templateVariables = [],
}: Props) => {
  const trpc = useTRPC();
  const credentialsQuery = useQuery(trpc.credentials.getMany.queryOptions());
  const initialMemoryWritesKey = JSON.stringify(
    defaultMemoryWrites ?? EMPTY_MEMORY_WRITES,
  );
  const initialMemoryWrites = useMemo(
    () =>
      JSON.parse(initialMemoryWritesKey) as ExecutionMemoryWriteConfig[],
    [initialMemoryWritesKey],
  );
  const discordCredentials = (credentialsQuery.data ?? []).filter(
    (credential) => credential.provider === "DISCORD",
  );

  const form = useForm<
    z.input<typeof discordMessageNodeSchema>,
    unknown,
    DiscordMessageFormValues
  >({
    resolver: zodResolver(discordMessageNodeSchema),
    defaultValues: {
      credentialId: defaultCredentialId,
      credentialField: defaultCredentialField,
      content: defaultContent,
      memoryWrites: initialMemoryWrites,
    },
  });
  const credentialId = useWatch({
    control: form.control,
    name: "credentialId",
    defaultValue: defaultCredentialId,
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
      credentialId: defaultCredentialId,
      credentialField: defaultCredentialField,
      content: defaultContent,
      memoryWrites: initialMemoryWrites,
    });
  }, [
    defaultCredentialField,
    defaultCredentialId,
    defaultContent,
    initialMemoryWrites,
    form,
  ]);

  const insertIntoField = (field: "content", template: string) => {
    const currentValue = form.getValues(field) ?? "";
    const nextValue = currentValue.trim()
      ? `${currentValue}\n${template}`
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <MessageSquareIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Configure Discord Message</DialogTitle>
              <DialogDescription className="pt-2">
                Send a templated message to a Discord webhook credential. The
                message field supports workflow templates like{" "}
                <code>{"{{steps.NODE_ID.output.text}}"}</code>.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit((values) => onSubmit(values))}
          className="space-y-4"
        >
          <FieldGroup>
            <FieldLabel htmlFor="credentialId">Discord credential</FieldLabel>
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
                <SelectValue placeholder="Select Discord credential" />
              </SelectTrigger>
              <SelectContent>
                {discordCredentials.map((credential) => (
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
            <div className="flex items-center justify-between gap-3">
              <FieldLabel htmlFor="content">Message</FieldLabel>
              <TemplateVariablePicker
                options={templateVariables}
                onSelect={(value) => insertIntoField("content", value)}
              />
            </div>
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

          <FieldGroup className="rounded-xl border border-border/70 bg-muted/20 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <FieldLabel>Write to memory</FieldLabel>
                <FieldDescription>
                  Persist selected values into execution memory. Useful templates:
                  {" "}
                  <code>{"{{current.output}}"}</code>
                  {" "}、
                  <code>{"{{current.output.content}}"}</code>
                  {" "}、
                  <code>{"{{input}}"}</code>
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
                            placeholder="messageResult"
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
                          onSelect={(value) =>
                            insertMemoryWriteTemplate(index, value)
                          }
                          label="Insert"
                        />
                      </div>
                      <Field>
                        <Textarea
                          rows={3}
                          className="resize-none"
                          {...form.register(`memoryWrites.${index}.value`)}
                          placeholder='{{current.output.content}}'
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
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
