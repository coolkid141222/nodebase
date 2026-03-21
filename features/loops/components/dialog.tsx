"use client";

import { useEffect, useMemo } from "react";
import { RotateCwIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
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
import {
  createDefaultExecutionMemoryWriteConfig,
  type ExecutionMemoryWriteConfig,
} from "@/features/executions/memory/shared";
import { TemplateVariablePicker } from "@/features/executions/components/template-variable-picker";
import type { TemplateVariableOption } from "@/features/executions/components/template-variables";
import { loopNodeSchema } from "../shared";

const EMPTY_MEMORY_WRITES: ExecutionMemoryWriteConfig[] = [];

export type LoopFormValues = z.output<typeof loopNodeSchema>;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: LoopFormValues) => void;
  defaultMaxIterations?: number;
  defaultMemoryWrites?: ExecutionMemoryWriteConfig[];
  templateVariables?: TemplateVariableOption[];
};

export function LoopDialog({
  open,
  onOpenChange,
  onSubmit,
  defaultMaxIterations = 3,
  defaultMemoryWrites,
  templateVariables = [],
}: Props) {
  const initialMemoryWritesKey = JSON.stringify(
    defaultMemoryWrites ?? EMPTY_MEMORY_WRITES,
  );
  const initialMemoryWrites = useMemo(
    () =>
      JSON.parse(initialMemoryWritesKey) as ExecutionMemoryWriteConfig[],
    [initialMemoryWritesKey],
  );
  const form = useForm<z.input<typeof loopNodeSchema>, unknown, LoopFormValues>({
    resolver: zodResolver(loopNodeSchema),
    defaultValues: {
      maxIterations: defaultMaxIterations,
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
      maxIterations: defaultMaxIterations,
      memoryWrites: initialMemoryWrites,
    });
  }, [defaultMaxIterations, form, initialMemoryWrites]);

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
              <RotateCwIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Configure Loop Scope</DialogTitle>
              <DialogDescription className="pt-2">
                One loop node controls one closed cyclic region. The enclosed
                body repeats up to the configured limit, then the workflow
                continues to downstream nodes exactly once.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit((values) => onSubmit(values))}
          className="space-y-4"
        >
          <div className="rounded-xl border border-border/70 bg-muted/20 p-4">
            <div className="text-sm font-medium text-foreground">
              How to use this loop
            </div>
            <ol className="mt-2 space-y-1.5 text-sm leading-6 text-muted-foreground">
              <li>1. Put exactly one Loop node inside the section you want to repeat.</li>
              <li>2. Connect a closed cycle through that section, for example <code>{"Loop -> AI Text -> Loop"}</code>.</li>
              <li>3. Keep downstream nodes outside the cycle. They run only after the last iteration.</li>
            </ol>
          </div>

          <FieldGroup>
            <FieldLabel htmlFor="maxIterations">Scope iteration limit</FieldLabel>
            <Field>
              <Input
                id="maxIterations"
                type="number"
                min={1}
                max={25}
                {...form.register("maxIterations", { valueAsNumber: true })}
              />
            </Field>
            <FieldDescription>
              The enclosed loop body can repeat up to this many times.
            </FieldDescription>
            <FieldError errors={[form.formState.errors.maxIterations]} />
          </FieldGroup>

          <FieldGroup className="rounded-xl border border-border/70 bg-muted/20 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <FieldLabel>Write to memory</FieldLabel>
                <FieldDescription>
                  Persist scope state into execution memory. Useful templates:{" "}
                  <code>{"{{current.attempt}}"}</code>,{" "}
                  <code>{"{{current.output.value}}"}</code>,{" "}
                  <code>{"{{input}}"}</code>.
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
                            placeholder="loop"
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
                            placeholder="iteration"
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
                          placeholder='{{current.attempt}}'
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
}
