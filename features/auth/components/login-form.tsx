"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { useRouter } from "next/navigation";
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
import { signIn } from "@/lib/auth-client";
import { useState } from "react";

type LoginFormProps = {
  googleEnabled: boolean;
  githubEnabled: boolean;
};

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm({ googleEnabled, githubEnabled }: LoginFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [socialPending, setSocialPending] = useState<"google" | "github" | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setError("");
    try {
      const result = await signIn.email({
        email: values.email,
        password: values.password,
      });

      if (result.error) {
        setError(result.error.message || "Login Failed");
        return;
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      setError("An unexpected error occurred. Please try it later");
      console.log("Login error", err);
    }
  };

  const handleSocialSignIn = async (provider: "google" | "github") => {
    setError("");
    setSocialPending(provider);

    try {
      const result = await signIn.social({
        provider,
        callbackURL: "/",
      });

      if (result?.error) {
        setError(result.error.message || "Social sign in failed");
      }
    } catch {
      setError("Social sign in failed");
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
        <CardHeader className="flex flex-col items-center justify-center space-y-3 text-center pt-10 pb-6 px-8">

          <CardTitle className="text-3xl font-bold text-slate-900">
            Welcome back
          </CardTitle>
          <CardDescription className="text-base text-slate-600">
            Sign in to keep building your workspace
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
              {socialPending === "google" ? "Redirecting..." : "Google"}
            </Button>

            <Button
              variant="outline"
              className="group flex w-full items-center justify-center gap-2 rounded-xl border-slate-200 bg-white h-11 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
              type="button"
              disabled={isBusy || !githubEnabled}
              onClick={() => handleSocialSignIn("github")}
            >
              <img src="/github.svg" alt="GitHub" className="h-5 w-5" />
              {socialPending === "github" ? "Redirecting..." : "GitHub"}
            </Button>
          </div>

          {!googleEnabled && !githubEnabled ? (
            <div className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Google/GitHub auth is not configured yet. Email login remains available for existing accounts.
            </div>
          ) : null}

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

          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                        suppressHydrationWarning
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
                        autoComplete="current-password"
                        suppressHydrationWarning
                        className="h-11 rounded-lg border-slate-200 bg-white px-4 text-sm transition focus:border-orange-400 focus:bg-white focus-visible:ring-2 focus-visible:ring-orange-400/20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                  />
                  Remember me
                </label>

                <Link
                  href="/forgot-password"
                  className="font-medium text-slate-700 hover:text-orange-600"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full h-11 rounded-lg bg-slate-900 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-80"
                disabled={isBusy}
              >
                {isPending ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    Sign in
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                )}
              </Button>
            </form>
          </Form>

          <div className="text-center text-sm text-slate-600">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-slate-900 hover:text-orange-600"
            >
              Sign up
            </Link>
          </div>

          <p className="text-center text-xs text-slate-500">
            By continuing, you agree to our{" "}
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
