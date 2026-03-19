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
import { PlayIcon } from "lucide-react"
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
import { useForm, useWatch } from "react-hook-form";
import { useEffect } from "react";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import {
  httpRequestAuthTypeSchema,
  httpRequestMethodSchema,
} from "../../http-request/shared";

const formSchema = z.object({
    endpoint: z.url({ message: "Please enter a vaild url "}),
    method: httpRequestMethodSchema,
    body: z
        .string()
        .optional(),
    credentialId: z.string().optional(),
    authType: httpRequestAuthTypeSchema.default("NONE"),
    credentialField: z.string().optional(),
    headerName: z.string().optional(),
}).superRefine((value, ctx) => {
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
}: Props) => {
    const trpc = useTRPC();
    const credentialsQuery = useQuery(trpc.credentials.getMany.queryOptions());
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

    useEffect(() => {
        form.reset({
            endpoint: defaultEndpoint,
            method: defaultMethod,
            body: defaultBody,
            credentialId: defaultCredentialId || "none",
            credentialField: defaultCredentialField,
            authType: defaultAuthType,
            headerName: defaultHeaderName,
        })
    }, [
        defaultEndpoint,
        defaultMethod,
        defaultBody,
        defaultCredentialId,
        defaultCredentialField,
        defaultAuthType,
        defaultHeaderName,
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
