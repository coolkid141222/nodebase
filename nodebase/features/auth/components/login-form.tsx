"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ArrowRight, Chrome, Github, Loader2 } from "lucide-react";
import { signIn } from "@/lib/auth-client";
import { useState } from "react";


const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string>("");

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

  const isPending = form.formState.isSubmitting;

  return (
    <div className="font-sans relative flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-600 via-blue-700 to-purple-700 px-4 py-12 overflow-hidden">
      <div className="pointer-events-none absolute inset-x-10 -top-16 h-48 rounded-full bg-gradient-to-r from-blue-300/50 via-white/30 to-purple-300/50 blur-3xl" />

      <Card className="relative w-full max-w-md overflow-hidden rounded-xl border-0 bg-white shadow-2xl">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400" />
        <CardHeader className="space-y-2 text-center pt-8">

          <CardTitle className="text-3xl font-bold text-slate-900 flex flex-col">
            Welcome back
          </CardTitle>
          <CardDescription className="text-base text-slate-600 pt-1">
            Sign in to keep building your workspace.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-8">
          <div className="grid gap-4 sm:grid-cols-2">

            {/* -- 社交按钮 (h-12, gap-3) -- */}
            <Button
              variant="outline"
              className="group flex w-full items-center justify-center gap-3 rounded-lg border-slate-300 bg-white h-12 text-base text-slate-800 transition hover:-translate-y-[1px] hover:border-blue-400 hover:bg-blue-50"
              type="button"
              disabled={isPending}
            >
              <Chrome className="h-5 w-5 text-blue-500" />
              Google
            </Button>

            {/* -- 社交按钮 (h-12, gap-3) -- */}
            <Button
              variant="outline"
              className="group flex w-full items-center justify-center gap-3 rounded-lg border-slate-800 bg-slate-900 h-12 text-base text-white transition hover:-translate-y-[1px] hover:bg-slate-800"
              type="button"
              disabled={isPending}
            >
              <Github className="h-5 w-5" />
              GitHub
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-sm font-medium uppercase tracking-wide text-slate-500">
              or
            </span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-800">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="m@example.com"
                        autoComplete="email"
                        suppressHydrationWarning
                        // -- 输入框 (添加 px-4) --
                        className="h-12 rounded-lg border-slate-300 bg-slate-50 px-4 text-base transition focus:bg-white focus-visible:ring-2 focus-visible:ring-blue-500/80"
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
                    <FormLabel className="text-sm font-medium text-slate-800">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        autoComplete="current-password"
                        suppressHydrationWarning
                        // -- 输入框 (添加 px-4) --
                        className="h-12 rounded-lg border-slate-300 bg-slate-50 px-4 text-base transition focus:bg-white focus-visible:ring-2 focus-visible:ring-blue-500/80"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between text-sm text-slate-600">
                <label className="flex items-center gap-2 font-medium">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  Remember me
                </label>

                <Link
                  href="/forgot-password"
                  className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {/* -- 最终的按钮样式 -- */}
              <Button
                type="submit"
                className="group relative w-full h-12 rounded-lg bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-base text-white shadow-lg transition-all hover:-translate-y-[1px] hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-80"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="absolute left-4 top-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    {/* -- 图标在左侧 -- */}
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 transition group-hover:translate-x-1">
                      <ArrowRight className="h-5 w-5" />
                    </span>
                    {/* -- 文字在中间 -- */}
                    Sign in
                  </>
                )}
              </Button>
            </form>
          </Form>

          {/* -- 在这里添加跳转到注册页面的链接 -- */}
          <p className="text-center text-sm text-slate-600">
            Don't have an account?{" "}
            <Link
              href="/register" // 假设注册页路由为 /register
              className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
            >
              Sign up
            </Link>
          </p>

          <p className="text-center text-sm text-slate-600">
            By continuing, you agree to our{" "}

            <Link
              href="/terms"
              className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
            >
              Terms
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
