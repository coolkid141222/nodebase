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
import { useForm } from "react-hook-form";
import { useEffect } from "react";

const formSchema = z.object({
    endpoint: z.url({ message: "Please enter a vaild url "}),
    method: z.enum(["GET", "POST", "PATCH", "DELETE"]),
    body: z
        .string()
        .optional()
})

export type FormType = z.infer<typeof formSchema>

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (values: z.infer<typeof formSchema>) => void;
    defaultEndpoint?: string;
    defaultMethod?: "GET" | "POST" | "PATCH" | "DELETE";
    defaultBody?: string;
}

export const HttpRequestDialog = ({
    open,
    onOpenChange,
    onSubmit,
    defaultEndpoint = "",
    defaultMethod = "GET",
    defaultBody = "",
}: Props) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            endpoint: defaultEndpoint,
            method: defaultMethod,
            body: defaultBody,
        },
    })

    useEffect(() => {
        if (defaultEndpoint || defaultMethod || defaultBody) {
            form.reset({
                endpoint: defaultEndpoint,
                method: defaultMethod,
                body: defaultBody,
            })
        }
    }, [defaultEndpoint, defaultMethod, defaultBody, form.reset])

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
                                配置请求的端点、方法和请求体
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                                value={form.watch("method")}
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
