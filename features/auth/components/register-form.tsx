"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/collapsible";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/form";
import { ArrowRight, ChevronDown, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LanguageToggle } from "@/features/i18n/components/language-toggle";
import { useI18n } from "@/features/i18n/provider";

function getAuthErrorMessage(error: unknown) {
  if (!error || typeof error !== "object") return "";

  const typedError = error as {
    message?: unknown;
    statusText?: unknown;
    error?: unknown;
    code?: unknown;
  };

  if (typedError.error && typeof typedError.error === "object") {
    const nestedError = typedError.error as {
      message?: unknown;
      code?: unknown;
    };

    if (
      typeof nestedError.message === "string" &&
      nestedError.message.trim().length > 0
    ) {
      return nestedError.message;
    }

    if (
      typeof nestedError.code === "string" &&
      nestedError.code.trim().length > 0
    ) {
      return nestedError.code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL"
        ? "User already exists. Use another email."
        : nestedError.code;
    }
  }

  if (typeof typedError.message === "string" && typedError.message.trim().length > 0) {
    return typedError.message;
  }

  if (
    typeof typedError.statusText === "string" &&
    typedError.statusText.trim().length > 0
  ) {
    return typedError.statusText;
  }

  if (typeof typedError.code === "string" && typedError.code.trim().length > 0) {
    return typedError.code;
  }

  return "";
}

// --- 1. 更新 Zod 验证 ---
const createRegisterSchema = (t: (key: string) => string) =>
  z
    .object({
      name: z.string().min(2, t("auth.register.nameTooShort")),
      email: z.string().email(t("auth.login.emailInvalid")),
      password: z.string().min(6, t("auth.register.passwordTooShort")),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("auth.register.passwordMismatch"),
      path: ["confirmPassword"],
    });

type RegisterFormValues = z.infer<ReturnType<typeof createRegisterSchema>>;

type RegisterFormProps = {
  googleEnabled: boolean;
  githubEnabled: boolean;
  ownerEmailSignupEnabled: boolean;
};

export function RegisterForm({
  googleEnabled,
  githubEnabled,
  ownerEmailSignupEnabled,
}: RegisterFormProps) { // --- 2. 更改组件名称 ---
  const { t } = useI18n();
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [socialPending, setSocialPending] = useState<"google" | "github" | null>(null);
  const registerSchema = createRegisterSchema(t);
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setError("");
    try {
      const result = await authClient.signUp.email({
        name: values.name,
        email: values.email,
        password: values.password,
        callbackURL: "/",
      });

      if (result.error) {
        setError(
          getAuthErrorMessage(result.error) ||
            (result.error.status === 422
              ? t("auth.register.emailExists")
              : t("auth.register.signUpFailed"))
        );
        return;
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      setError(
        getAuthErrorMessage(err) ||
          t("auth.register.signUpFailed")
      );
    }
  };

  const handleSocialSignIn = async (provider: "google" | "github") => {
    setError("");
    setSocialPending(provider);

    try {
      const result = await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });

      if (result?.error) {
        setError(getAuthErrorMessage(result.error) || t("auth.login.socialFailed"));
      }
    } catch (err) {
      setError(getAuthErrorMessage(err) || t("auth.login.socialFailed"));
    } finally {
      setSocialPending(null);
    }
  };

  const isPending = form.formState.isSubmitting;
  const isBusy = isPending || socialPending !== null;

  return (
    <div className="font-sans relative flex min-h-screen items-center justify-center bg-linear-to-br from-orange-100 via-amber-50 to-blue-100 px-4 py-12 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-linear-to-br from-orange-300/40 to-amber-200/40 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-linear-to-tr from-blue-300/40 to-indigo-200/40 blur-3xl" />
      </div>

      <Card className="relative w-full max-w-md overflow-hidden rounded-2xl border-0 bg-white/80 backdrop-blur-xl shadow-2xl">
        <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-orange-400 via-amber-400 to-blue-400" />
        <div className="absolute right-6 top-6">
          <LanguageToggle compact />
        </div>
        <CardHeader className="flex flex-col items-center justify-center space-y-3 text-center pt-10 pb-6 px-8">

          <CardTitle className="text-3xl font-bold text-slate-900">
            {t("auth.register.title")}
          </CardTitle>
          <CardDescription className="text-base text-slate-600">
            {t("auth.register.subtitle")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 px-8 pb-8">
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="group flex w-full items-center justify-center gap-2 rounded-xl border-slate-200 bg-white h-11 text-sm font-medium text-slate-700 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700"
              type="button"
              disabled={isBusy || !googleEnabled}
              onClick={() => handleSocialSignIn("google")}
            >
              <img src="/google.svg" alt="Google" className="h-5 w-5" />
              {socialPending === "google" ? t("auth.login.redirecting") : "Google"}
            </Button>

            <Button
              variant="outline"
              className="group flex w-full items-center justify-center gap-2 rounded-xl border-slate-200 bg-white h-11 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
              type="button"
              disabled={isBusy || !githubEnabled}
              onClick={() => handleSocialSignIn("github")}
            >
              <img src="/github.svg" alt="GitHub" className="h-5 w-5" />
              {socialPending === "github" ? t("auth.login.redirecting") : "GitHub"}
            </Button>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-600">
            <p>{t("auth.register.publicSocialOnly")}</p>
            <p className="mt-1 text-slate-500">
              {googleEnabled || githubEnabled
                ? t("auth.register.useConfiguredProvider")
                : t("auth.register.socialUnavailable")}
            </p>
          </div>

          {ownerEmailSignupEnabled ? (
            <Collapsible className="rounded-xl border border-slate-200 bg-white">
              <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-3 text-left">
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {t("auth.register.ownerSignup")}
                  </p>
                  <p className="text-xs text-slate-500">
                    {t("auth.register.ownerSignupHint")}
                  </p>
                </div>
                <ChevronDown className="h-4 w-4 text-slate-500 transition-transform data-[state=open]:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent className="border-t border-slate-200 px-4 py-4">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-slate-700">{t("auth.register.fullName")}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="John Doe"
                              autoComplete="name"
                              className="h-11 rounded-lg border-slate-200 bg-white px-4 text-sm transition focus:border-orange-400 focus:bg-white focus-visible:ring-2 focus-visible:ring-orange-400/20"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-slate-700">{t("auth.login.email")}</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="name@example.com"
                              autoComplete="email"
                              className="h-11 rounded-lg border-slate-200 bg-white px-4 text-sm transition focus:border-orange-400 focus:bg-white focus-visible:ring-2 focus-visible:ring-orange-400/20"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-slate-700">{t("auth.login.password")}</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="••••••••"
                              autoComplete="new-password"
                              className="h-11 rounded-lg border-slate-200 bg-white px-4 text-sm transition focus:border-orange-400 focus:bg-white focus-visible:ring-2 focus-visible:ring-orange-400/20"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-slate-700">{t("auth.register.confirmPassword")}</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="••••••••"
                              autoComplete="new-password"
                              className="h-11 rounded-lg border-slate-200 bg-white px-4 text-sm transition focus:border-orange-400 focus:bg-white focus-visible:ring-2 focus-visible:ring-orange-400/20"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full h-11 rounded-lg bg-slate-900 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-80"
                      disabled={isBusy}
                    >
                      {isPending ? (
                        <span className="flex items-center justify-center">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t("auth.register.creatingAccount")}
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          {t("auth.register.createAccount")}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </span>
                      )}
                    </Button>
                  </form>
                </Form>
              </CollapsibleContent>
            </Collapsible>
          ) : null}

          {error ? (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <div className="text-center text-sm text-slate-600">
            {t("auth.register.haveAccount")}{" "}
            <Link
              href="/login"
              className="font-medium text-slate-900 hover:text-orange-600"
            >
              {t("auth.register.signIn")}
            </Link>
          </div>

          <p className="text-center text-xs text-slate-500">
            {t("auth.register.termsPrefix")}{" "}
            <Link
              href="/terms"
              className="font-medium text-slate-700 hover:text-orange-600"
            >
              {t("auth.register.terms")}
            </Link>{" "}
            {t("common.and")}{" "}
            <Link
              href="/privacy"
              className="font-medium text-slate-700 hover:text-orange-600"
            >
              {t("auth.register.privacy")}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
