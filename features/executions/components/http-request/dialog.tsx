"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/dialog"
import { Button } from "@/components/button"
import { PlayIcon, PlusIcon, Trash2Icon } from "lucide-react"
import z from "zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/field"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/select"
import { Textarea } from "@/components/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { useEffect, useMemo } from "react";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import {
  httpRequestNodeSchema,
} from "../../http-request/shared";
import {
  createDefaultExecutionMemoryWriteConfig,
  type ExecutionMemoryWriteConfig,
} from "../../memory/shared";

const EMPTY_MEMORY_WRITES: ExecutionMemoryWriteConfig[] = [];

const formSchema = httpRequestNodeSchema.superRefine((value, ctx) => {
    const hasCredential = Boolean(value.credentialId && value.credentialId !== "none");

    if (!hasCredential) {
        return;
    }

    if (value.authType === "NONE") {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Select how to inject the credential into the request.",
            path: ["authType"],
        });
    }

    if (!value.credentialField?.trim()) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Enter the JSON field to read from the selected credential.",
            path: ["credentialField"],
        });
    }

    if (value.authType === "HEADER" && !value.headerName?.trim()) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Header auth requires a header name.",
            path: ["headerName"],
        });
    }
});

export type FormType = z.output<typeof formSchema>

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (values: z.infer<typeof formSchema>) => void;
    defaultEndpoint?: string;
    defaultMethod?: "GET" | "POST" | "PATCH" | "DELETE";
    defaultBody?: string;
    defaultCredentialId?: string;
    defaultCredentialField?: string;
    defaultAuthType?: "NONE" | "BEARER" | "HEADER";
    defaultHeaderName?: string;
    defaultMemoryWrites?: ExecutionMemoryWriteConfig[];
}

export const HttpRequestDialog = ({
    open,
    onOpenChange,
    onSubmit,
    defaultEndpoint = "",
    defaultMethod = "GET",
    defaultBody = "",
    defaultCredentialId = "",
    defaultCredentialField = "",
    defaultAuthType = "NONE",
    defaultHeaderName = "",
    defaultMemoryWrites,
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
    const form = useForm<z.input<typeof formSchema>, unknown, FormType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            endpoint: defaultEndpoint,
            method: defaultMethod,
            body: defaultBody,
            credentialId: defaultCredentialId || "none",
            credentialField: defaultCredentialField,
            authType: defaultAuthType,
            headerName: defaultHeaderName,
            memoryWrites: initialMemoryWrites,
        },
    })
    const method = useWatch({
        control: form.control,
        name: "method",
    });
    const credentialId = useWatch({
        control: form.control,
        name: "credentialId",
    });
    const authType = useWatch({
        control: form.control,
        name: "authType",
    });
    const hasCredential = Boolean(credentialId && credentialId !== "none");
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
            endpoint: defaultEndpoint,
            method: defaultMethod,
            body: defaultBody,
            credentialId: defaultCredentialId || "none",
            credentialField: defaultCredentialField,
            authType: defaultAuthType,
            headerName: defaultHeaderName,
            memoryWrites: initialMemoryWrites,
        })
    }, [
        defaultEndpoint,
        defaultMethod,
        defaultBody,
        defaultCredentialId,
        defaultCredentialField,
        defaultAuthType,
        defaultHeaderName,
        initialMemoryWrites,
        form,
    ])

    useEffect(() => {
        if (!hasCredential) {
            form.setValue("authType", "NONE");
            form.setValue("credentialField", "");
            form.setValue("headerName", "");
            return;
        }

        if (authType !== "HEADER") {
            form.setValue("headerName", "");
        }
    }, [authType, form, hasCredential])

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <PlayIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <DialogTitle>配置 HTTP 请求</DialogTitle>
                            <DialogDescription className="pt-2">
                                配置请求的端点、方法和请求体。支持模板变量，例如
                                {" "}
                                <code>{"{{execution.id}}"}</code>
                                {" "}、
                                <code>{"{{input.body.message}}"}</code>
                                {" "}、
                                <code>{"{{inputs.main.text}}"}</code>
                                {" "}、
                                <code>{"{{memory.shared.nodesById.NODE_ID.output}}"}</code>
                                {" "}、
                                <code>{"{{memory.node.run.output}}"}</code>
                                {" "}、
                                <code>{"{{trigger.source}}"}</code>
                                {" "}、
                                <code>{"{{steps.NODE_ID.output.body}}"}</code>
                                。也可以绑定凭据并注入为 Bearer 或自定义 Header。
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form
                    onSubmit={form.handleSubmit((values) => onSubmit(values))}
                    className="space-y-4"
                >
                    <div className="space-y-4">
                        {/* Endpoint */}
                        <FieldGroup>
                            <FieldLabel htmlFor="endpoint">端点 URL</FieldLabel>
                            <Field>
                                <input
                                    id="endpoint"
                                    {...form.register("endpoint")}
                                    placeholder="https://api.example.com/data"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                            </Field>
                        </FieldGroup>

                        {/* Method */}
                        <FieldGroup>
                            <FieldLabel htmlFor="method">请求方法</FieldLabel>
                            <Select
                                value={method}
                                onValueChange={(value: "GET" | "POST" | "PATCH" | "DELETE") => form.setValue("method", value)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="选择方法" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="GET">GET</SelectItem>
                                    <SelectItem value="POST">POST</SelectItem>
                                    <SelectItem value="PATCH">PATCH</SelectItem>
                                    <SelectItem value="DELETE">DELETE</SelectItem>
                                </SelectContent>
                            </Select>
                            {form.formState.errors.method && (
                                <FieldError>{form.formState.errors.method.message}</FieldError>
                            )}
                        </FieldGroup>

                        {/* Body */}
                        <FieldGroup>
                            <FieldLabel htmlFor="body">请求体</FieldLabel>
                            <Field>
                                <Textarea
                                    id="body"
                                    {...form.register("body")}
                                    placeholder='{"userName": "john_doe", "email": "john@example.com"}'
                                    rows={6}
                                    className="resize-none"
                                />
                            </Field>
                            {form.formState.errors.body && (
                                <FieldError>{form.formState.errors.body.message}</FieldError>
                            )}
                        </FieldGroup>

                        <FieldGroup>
                            <FieldLabel htmlFor="credentialId">凭据</FieldLabel>
                            <Select
                                value={credentialId || "none"}
                                onValueChange={(value) => form.setValue("credentialId", value, { shouldValidate: true })}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="选择凭据" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">No credential</SelectItem>
                                    {(credentialsQuery.data ?? []).map((credential) => (
                                        <SelectItem key={credential.id} value={credential.id}>
                                            {credential.name} ({credential.provider})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FieldGroup>

                        {hasCredential && (
                            <>
                                <FieldGroup>
                                    <FieldLabel htmlFor="authType">鉴权方式</FieldLabel>
                                    <Select
                                        value={authType}
                                        onValueChange={(value: "NONE" | "BEARER" | "HEADER") =>
                                            form.setValue("authType", value, { shouldValidate: true })
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="选择鉴权方式" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="BEARER">Authorization Bearer</SelectItem>
                                            <SelectItem value="HEADER">Custom header</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {form.formState.errors.authType && (
                                        <FieldError>{form.formState.errors.authType.message}</FieldError>
                                    )}
                                </FieldGroup>

                                <FieldGroup>
                                    <FieldLabel htmlFor="credentialField">Secret JSON field</FieldLabel>
                                    <Field>
                                        <input
                                            id="credentialField"
                                            {...form.register("credentialField")}
                                            placeholder="apiKey"
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        />
                                    </Field>
                                    {form.formState.errors.credentialField && (
                                        <FieldError>{form.formState.errors.credentialField.message}</FieldError>
                                    )}
                                </FieldGroup>

                                {authType === "HEADER" && (
                                    <FieldGroup>
                                        <FieldLabel htmlFor="headerName">Header name</FieldLabel>
                                        <Field>
                                            <input
                                                id="headerName"
                                                {...form.register("headerName")}
                                                placeholder="x-api-key"
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            />
                                        </Field>
                                        {form.formState.errors.headerName && (
                                            <FieldError>{form.formState.errors.headerName.message}</FieldError>
                                        )}
                                    </FieldGroup>
                                )}
                            </>
                        )}

                        <FieldGroup className="rounded-xl border border-border/70 bg-muted/20 p-4">
                            <div className="flex items-start justify-between gap-3">
                                <div className="space-y-1">
                                    <FieldLabel>Write to memory</FieldLabel>
                                    <p className="text-sm text-muted-foreground">
                                        Persist selected values into execution memory. Useful templates:
                                        {" "}
                                        <code>{"{{current.output}}"}</code>
                                        {" "}、
                                        <code>{"{{current.output.body}}"}</code>
                                        {" "}、
                                        <code>{"{{memory.shared.run.trigger}}"}</code>
                                    </p>
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
                                                        <input
                                                            {...form.register(`memoryWrites.${index}.namespace`)}
                                                            placeholder="results"
                                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                                        />
                                                    </Field>
                                                    <FieldError>
                                                        {form.formState.errors.memoryWrites?.[index]?.namespace?.message}
                                                    </FieldError>
                                                </FieldGroup>

                                                <FieldGroup>
                                                    <FieldLabel>Key</FieldLabel>
                                                    <Field>
                                                        <input
                                                            {...form.register(`memoryWrites.${index}.key`)}
                                                            placeholder="response"
                                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                                        />
                                                    </Field>
                                                    <FieldError>
                                                        {form.formState.errors.memoryWrites?.[index]?.key?.message}
                                                    </FieldError>
                                                </FieldGroup>
                                            </div>

                                            <FieldGroup>
                                                <FieldLabel>Value template</FieldLabel>
                                                <Field>
                                                    <Textarea
                                                        rows={3}
                                                        className="resize-none"
                                                        {...form.register(`memoryWrites.${index}.value`)}
                                                        placeholder='{{current.output.body}}'
                                                    />
                                                </Field>
                                                <FieldError>
                                                    {form.formState.errors.memoryWrites?.[index]?.value?.message}
                                                </FieldError>
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
                    </div>

                    <DialogFooter className="gap-2 sm:justify-end">
                        <Button
                            type="submit"
                            disabled={form.formState.isSubmitting}
                        >
                            {form.formState.isSubmitting ? "保存中..." : "保存"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
