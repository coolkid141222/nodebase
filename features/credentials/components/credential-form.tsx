"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon, KeyRoundIcon, Loader2Icon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/card";
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
  useCreateCredential,
  useDeleteCredential,
  useSuspenseCredential,
  useUpdateCredential,
} from "../hooks/use-credentials";
import { credentialProviders } from "../server/payload";
import { CredentialProvider } from "@/lib/prisma/client";

const formSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  provider: z.nativeEnum(CredentialProvider),
  description: z.string().max(500),
  secretJson: z.string().min(2, "Secret JSON is required"),
});

type FormValues = z.infer<typeof formSchema>;

const defaultSecretJson = `{
  "apiKey": ""
}`;

type CredentialFormCardProps = {
  title: string;
  description: string;
  defaultValues: FormValues;
  isPending?: boolean;
  onSubmit: (values: FormValues) => void;
  onDelete?: () => void;
  isDeleting?: boolean;
};

function CredentialFormCard({
  title,
  description,
  defaultValues,
  isPending,
  onSubmit,
  onDelete,
  isDeleting,
}: CredentialFormCardProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  const provider = useWatch({
    control: form.control,
    name: "provider",
  });

  return (
    <Card className="mx-auto w-full max-w-3xl shadow-none">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/credentials">
              <ArrowLeftIcon className="size-4" />
              Back
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          <FieldGroup>
            <FieldLabel htmlFor="name">Credential name</FieldLabel>
            <Field>
              <Input id="name" {...form.register("name")} placeholder="OpenAI production" />
            </Field>
            <FieldError errors={[form.formState.errors.name]} />
          </FieldGroup>

          <FieldGroup>
            <FieldLabel htmlFor="provider">Provider</FieldLabel>
            <Select
              value={provider}
              onValueChange={(value) =>
                form.setValue("provider", value as CredentialProvider, {
                  shouldDirty: true,
                })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                {credentialProviders.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError errors={[form.formState.errors.provider]} />
          </FieldGroup>

          <FieldGroup>
            <FieldLabel htmlFor="description">Description</FieldLabel>
            <Field>
              <Input
                id="description"
                {...form.register("description")}
                placeholder="Used by HTTP and AI nodes in production"
              />
            </Field>
            <FieldDescription>
              Optional label to explain where this credential is used.
            </FieldDescription>
            <FieldError errors={[form.formState.errors.description]} />
          </FieldGroup>

          <FieldGroup>
            <FieldLabel htmlFor="secretJson">Secret JSON</FieldLabel>
            <Field>
              <Textarea
                id="secretJson"
                rows={12}
                className="font-mono text-xs"
                {...form.register("secretJson")}
              />
            </Field>
            <FieldDescription>
              JSON object only for now. Example: {`{"apiKey":"..."}`} or{" "}
              {`{"token":"..."}`}.
            </FieldDescription>
            <FieldError errors={[form.formState.errors.secretJson]} />
          </FieldGroup>

          <div className="flex items-center justify-between gap-3">
            <div className="text-sm text-muted-foreground">
              Scaffold mode: secrets are serialized as JSON now. Encryption comes next.
            </div>
            <div className="flex items-center gap-2">
              {onDelete && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onDelete}
                  disabled={isDeleting || isPending}
                >
                  {isDeleting ? (
                    <Loader2Icon className="size-4 animate-spin" />
                  ) : (
                    <Trash2Icon className="size-4" />
                  )}
                  Delete
                </Button>
              )}
              <Button type="submit" disabled={isPending || isDeleting}>
                {isPending ? (
                  <Loader2Icon className="size-4 animate-spin" />
                ) : (
                  <KeyRoundIcon className="size-4" />
                )}
                Save credential
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export function NewCredentialForm() {
  const router = useRouter();
  const createCredential = useCreateCredential();

  const handleSubmit = (values: FormValues) => {
    createCredential.mutate(values, {
      onSuccess: (data) => {
        router.replace(`/credentials/${data.id}`);
      },
    });
  };

  return (
    <CredentialFormCard
      title="New credential"
      description="Create a reusable credential that workflow nodes can reference."
      defaultValues={{
        name: "",
        provider: CredentialProvider.OPENAI,
        description: "",
        secretJson: defaultSecretJson,
      }}
      onSubmit={handleSubmit}
      isPending={createCredential.isPending}
    />
  );
}

export function EditCredentialForm({ id }: { id: string }) {
  const router = useRouter();
  const credential = useSuspenseCredential(id);
  const updateCredential = useUpdateCredential();
  const deleteCredential = useDeleteCredential();

  const handleSubmit = (values: FormValues) => {
    updateCredential.mutate(
      {
        id,
        ...values,
      },
    );
  };

  const handleDelete = () => {
    deleteCredential.mutate(
      { id },
      {
        onSuccess: () => {
          router.replace("/credentials");
        },
      },
    );
  };

  return (
    <CredentialFormCard
      title={credential.data.name}
      description="Update provider details and serialized secret payload for this credential."
      defaultValues={{
        name: credential.data.name,
        provider: credential.data.provider,
        description: credential.data.description ?? "",
        secretJson: credential.data.secretJson,
      }}
      onSubmit={handleSubmit}
      onDelete={handleDelete}
      isPending={updateCredential.isPending}
      isDeleting={deleteCredential.isPending}
    />
  );
}
