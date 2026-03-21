"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
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
import { ArrowRight, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"], // 在“确认密码”字段下显示错误
});


type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() { // --- 2. 更改组件名称 ---
  const router = useRouter();
  const [error, setError] = useState<string>("");
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
              ? "This email is already registered or the account could not be created."
              : "Sign up failed. Please try again.")
        );
        return;
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      setError(
        getAuthErrorMessage(err) ||
          "Sign up failed. Please try again."
      );
    }
  };

  const isPending = form.formState.isSubmitting;

  return (
    <div className="font-sans relative flex min-h-screen items-center justify-center bg-linear-to-br from-orange-100 via-amber-50 to-blue-100 px-4 py-12 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-linear-to-br from-orange-300/40 to-amber-200/40 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-linear-to-tr from-blue-300/40 to-indigo-200/40 blur-3xl" />
      </div>

      <Card className="relative w-full max-w-md overflow-hidden rounded-2xl border-0 bg-white/80 backdrop-blur-xl shadow-2xl">
        <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-orange-400 via-amber-400 to-blue-400" />
        <CardHeader className="flex flex-col items-center justify-center space-y-3 text-center pt-10 pb-6 px-8">

          <CardTitle className="text-3xl font-bold text-slate-900">
            Create your account
          </CardTitle>
          <CardDescription className="text-base text-slate-600">
            Get started by creating a new account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 px-8 pb-8">
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="group flex w-full items-center justify-center gap-2 rounded-xl border-slate-200 bg-white h-11 text-sm font-medium text-slate-700 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700"
              type="button"
              disabled={isPending}
            >
              <img src="/google.svg" alt="Google" className="h-5 w-5" />
              Continue with Google
            </Button>

            <Button
              variant="outline"
              className="group flex w-full items-center justify-center gap-2 rounded-xl border-slate-200 bg-white h-11 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
              type="button"
              disabled={isPending}
            >
              <img src="/github.svg" alt="GitHub" className="h-5 w-5" />
              Continue with GitHub
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-3 text-slate-500">
                or continue with email
              </span>
            </div>
          </div>

          {error ? (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700">Full Name</FormLabel>
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
                    <FormLabel className="text-sm font-medium text-slate-700">Email</FormLabel>
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
                    <FormLabel className="text-sm font-medium text-slate-700">Password</FormLabel>
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
                    <FormLabel className="text-sm font-medium text-slate-700">Confirm Password</FormLabel>
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
                disabled={isPending}
              >
                {isPending ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    Create account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                )}
              </Button>
            </form>
          </Form>

          <div className="text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-slate-900 hover:text-orange-600"
            >
              Sign in
            </Link>
          </div>

          <p className="text-center text-xs text-slate-500">
            By creating an account, you agree to our{" "}
            <Link
              href="/terms"
              className="font-medium text-slate-700 hover:text-orange-600"
            >
              Terms
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="font-medium text-slate-700 hover:text-orange-600"
            >
              Privacy Policy
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
